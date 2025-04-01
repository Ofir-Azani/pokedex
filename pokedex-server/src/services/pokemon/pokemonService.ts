import { pool } from "../../db/db";

export const getAllPokemons = async () => {
  const { rows: pokemons } = await pool.query(`SELECT id, name, image FROM pokemons`);

  const [types, abilities, evolutions] = await Promise.all([
    pool.query(`
      SELECT pt.pokemon_id, t.name
      FROM pokemon_types pt
      JOIN types t ON pt.type_id = t.id
    `),
    pool.query(`
      SELECT pa.pokemon_id, a.name
      FROM pokemon_abilities pa
      JOIN abilities a ON pa.ability_id = a.id
    `),
    pool.query(`
      SELECT from_pokemon_id, to_pokemon_id, level
      FROM evolutions
    `),
  ]);

  const typeMap: Record<number, string[]> = {};
  const abilityMap: Record<number, string[]> = {};
  const evolutionMap: Record<number, { to: number; level: number | null }[]> = {};

  for (const row of types.rows) {
    if (!typeMap[row.pokemon_id]) typeMap[row.pokemon_id] = [];
    typeMap[row.pokemon_id]?.push(row.name);
  }

  for (const row of abilities.rows) {
    if (!abilityMap[row.pokemon_id]) abilityMap[row.pokemon_id] = [];
    abilityMap[row.pokemon_id]?.push(row.name);
  }

  for (const row of evolutions.rows) {
    if (!evolutionMap[row.from_pokemon_id]) evolutionMap[row.from_pokemon_id] = [];
    evolutionMap[row.from_pokemon_id]?.push({
      to: row.to_pokemon_id,
      level: row.level ?? null,
    });
  }

  return pokemons.map((pokemon) => ({
    id: pokemon.id,
    name: pokemon.name,
    types: typeMap[pokemon.id] || [],
    abilities: abilityMap[pokemon.id] || [],
    evolutions: evolutionMap[pokemon.id] || [],
    image: pokemon.image,
  }));
};