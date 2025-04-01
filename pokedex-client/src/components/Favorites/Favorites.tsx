import { usePokemons } from "../../context/PokemonProvider"
import { PokemonCard } from "../PokemonCard/PokemonCard";
import styles from "./Favorites.module.css";

const Favorites = () => {
    const { favorites, pokemons } = usePokemons();

    const favoritePokemons = Object.keys(favorites || {});

    return (
        <>
            <h2>Favorites</h2>
            <ul className={styles["favorite-pokemons_grid"]}>
                {favoritePokemons.length > 0
                    ? favoritePokemons.map((i: any) => {
                        const { id, name, types, image } = pokemons[i - 1];
                        return (
                            < li key={id} >
                                <PokemonCard
                                    id={id}
                                    name={name}
                                    types={types}
                                    image={image}
                                    readonly={true}
                                />
                            </li>)
                    })
                    : 'No Pokemon selecte as favorite'
                }
            </ul >
        </>
    )
}

export default Favorites