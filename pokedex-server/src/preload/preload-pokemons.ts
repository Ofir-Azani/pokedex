import { Client } from "pg";

const DB_URL = process.env.DATABASE_URL!;

const client = new Client({ connectionString: DB_URL });

const TOTAL_POKEMON = 150;
const BATCH_SIZE = 10;

const waitForPostgres = async (retries = 30, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await client.connect();
            return;
        } catch (err) {
            await new Promise((res) => setTimeout(res, delay));
        }
    }
    throw new Error("Could not connect to Postgres after multiple attempts");
};

const fetchJSON = (url: string) => fetch(url).then((res) => res.json());

const convertPokemon = (data: any) => {
    const id = data.id;
    const name = data.name;
    const level = Math.floor(Math.random() * 50) + 1;

    const types = data.types.map((t: any) => t.type.name);
    const abilities = data.abilities.map((a: any) => a.ability.name);
    const speciesUrl = data.species.url;
    const imageUrl = data.sprites.other.dream_world.front_default

    return { id, name, level, types, abilities, speciesUrl, imageUrl };
};

const insertType = async (name: string): Promise<number> => {
    const { rows } = await client.query("SELECT id FROM types WHERE name = $1", [name]);
    if (rows.length) return rows[0].id;

    const insert = await client.query("INSERT INTO types (name) VALUES ($1) RETURNING id", [name]);
    return insert.rows[0].id;
};

const insertAbility = async (name: string): Promise<number> => {
    const { rows } = await client.query("SELECT id FROM abilities WHERE name = $1", [name]);
    if (rows.length) return rows[0].id;

    const insert = await client.query("INSERT INTO abilities (name) VALUES ($1) RETURNING id", [name]);
    return insert.rows[0].id;
};

const insertPokemon = async (id: number, name: string, image: string, level: number) => {
    await client.query(
        "INSERT INTO pokemons (id, name, image, level) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
        [id, name, image, level]
    );
};

const insertRelations = async (pokemonId: number, typeIds: number[], abilityIds: number[]) => {
    for (const tid of typeIds) {
        await client.query(
            "INSERT INTO pokemon_types (pokemon_id, type_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [pokemonId, tid]
        );
    }
    for (const aid of abilityIds) {
        await client.query(
            "INSERT INTO pokemon_abilities (pokemon_id, ability_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [pokemonId, aid]
        );
    }
};

const parseEvolutionChain = (
    node: any,
    result: [number, number, number | null][]
) => {
    const from = node.species.url.split("/").filter(Boolean).pop();
    const fromId = parseInt(from);

    for (const evo of node.evolves_to) {
        const to = evo.species.url.split("/").filter(Boolean).pop();
        const toId = parseInt(to);
        const level = evo.evolution_details?.[0]?.min_level ?? null;

        result.push([fromId, toId, level]);
        parseEvolutionChain(evo, result);
    }
};

const insertEvolutions = async (triplets: [number, number, number | null][]) => {
    for (const [from, to, level] of triplets) {
        if (from <= TOTAL_POKEMON && to <= TOTAL_POKEMON) {
            await client.query(
                "INSERT INTO evolutions (from_pokemon_id, to_pokemon_id, level) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                [from, to, level]
            );
        }
    }
};

const insertFavorites = async () => {
    const { rows } = await client.query("SELECT id, username FROM users");
    const userA = rows.find((r) => r.username === "UserA");
    const userB = rows.find((r) => r.username === "UserB");

    if (!userA || !userB) {
        console.error("Users not found for favorites");
        return;
    }

    const favoritesA = [1, 25, 6];
    const favoritesB = [7, 150, 143];

    for (const id of favoritesA) {
        await client.query(
            "INSERT INTO favorites (user_id, pokemon_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [userA.id, id]
        );
    }

    for (const id of favoritesB) {
        await client.query(
            "INSERT INTO favorites (user_id, pokemon_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [userB.id, id]
        );
    }
}


const preload = async () => {
    try {
        await waitForPostgres();
        const evolutionChains = new Set<string>();

        for (let i = 1; i <= TOTAL_POKEMON; i += BATCH_SIZE) {
            const results = await Promise.all(
                Array.from({ length: BATCH_SIZE }, (_, j) =>
                    fetchJSON(`https://pokeapi.co/api/v2/pokemon/${i + j}`)
                )
            );

            for (const raw of results) {
                const { id, name, level, types, abilities, speciesUrl, imageUrl } = convertPokemon(raw);
                await insertPokemon(id, name, imageUrl, level);

                const typeIds = await Promise.all(types.map(insertType));
                const abilityIds = await Promise.all(abilities.map(insertAbility));
                await insertRelations(id, typeIds, abilityIds);

                evolutionChains.add(speciesUrl);
            }
        }

        const evoTriplets: [number, number, number | null][] = [];
        for (const speciesUrl of evolutionChains) {
            const species = await fetchJSON(speciesUrl) as any;
            if (!species || !species.evolution_chain.url) continue;
            const chain = await fetchJSON(species.evolution_chain.url) as any;
            if (!chain) continue;
            parseEvolutionChain(chain.chain, evoTriplets);
        }

        await insertEvolutions(evoTriplets);
        await insertFavorites();

        console.log("Preloading complete!");
    } catch (err) {
        console.error("Preload failed:", err);
    } finally {
        await client.end();
    }
};

preload()