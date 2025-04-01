
import { usePokemons } from "../../context/PokemonProvider";
import { Button } from "../shared";
import { Tag } from "../Tag";
import styles from "./PokemonData.module.css"


export const PokemonData = () => {
    const {
        pokemons,
        favorites,
        selectedPokemonId,
        deselectPokemon,
        selectPokemon,
        addToFavorites,
        removeFromFavorites
    } = usePokemons();


    if (!selectedPokemonId) return;

    const selectedPokemon = pokemons[+selectedPokemonId - 1];

    if (!selectedPokemon) return;

    const prevPokemon = pokemons[+selectedPokemonId - 2] || null;
    const nextPokemon = pokemons[+selectedPokemonId] || null;

    const handleNext = () => selectPokemon(nextPokemon.id);

    const handlePrev = () => selectPokemon(prevPokemon.id);

    const isFavorite = favorites && selectedPokemonId in favorites;

    const handleFavoriteButtonClicked = () => isFavorite
        ? removeFromFavorites(selectedPokemonId)
        : addToFavorites(selectedPokemonId);


    return (

        <section className={styles["pokemon"]}>
            <span
                className={styles["cover"]}
                data-type={selectedPokemon.types[0]}
            />
            <div className={styles["pokemon-details-list"]}>
                <h4>Types</h4>
                <ul className={styles["tags-list"]} >
                    {selectedPokemon.types.map((tid) => (
                        <li key={tid}>
                            <Tag label={tid} parentMainType={selectedPokemon.types[0]} />
                        </li>
                    ))}
                </ul>
                <h4>Abilities</h4>
                <ul className={styles["tags-list"]}>
                    {selectedPokemon.abilities.map((aid) => (
                        <li key={aid}>
                            <Tag label={aid} parentMainType={selectedPokemon.types[0]} />
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={deselectPokemon}
                className={styles["close-drawer_button"]}
            >
                X
            </button>
            <h4>
                {selectedPokemon.name}
                <span>{`${selectedPokemon.id}`.padStart(3, "0")}</span>
            </h4>
            <button onClick={handleFavoriteButtonClicked}>
                {isFavorite ? 'Remove from facorites' : 'Add to favorites'}
            </button>
            <img className={styles["pokecover"]} src={selectedPokemon.image} />
            {/* placeholder for evolution (already inside pokemon object) */}
            <div className={styles["nav-buttons_container"]}>
                {prevPokemon && <Button child={<img src={prevPokemon.image} />} clickHandler={handlePrev} />}
                {nextPokemon && <Button child={<img src={nextPokemon.image} />} clickHandler={handleNext} />}
            </div>
        </section>

    )
}