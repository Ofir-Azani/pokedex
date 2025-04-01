import { FC } from "react";
import { Tag } from "../Tag";
import styles from "./PokemonCard.module.css";
import { usePokemons } from "../../context/PokemonProvider";
import { PokemonType } from "../PokemonFilters/types";
import pokeball from "../../assets/pokeball.png"

export interface PokemonCardProps {
    id: string;
    name: string;
    types: [PokemonType, ...PokemonType[]];
    image: string;
    readonly?: boolean;
}
export const PokemonCard: FC<PokemonCardProps> = ({ id, name, types, image, readonly = false }) => {

    const { selectPokemon, favorites, addToFavorites, removeFromFavorites } = usePokemons();

    const isFavorite = favorites && id in favorites;

    const setFavorite = isFavorite ? removeFromFavorites : addToFavorites

    return (
        <article
            className={`${styles["pokemon-card_container"]} ${styles[readonly ? "readonly" : ""]}`}
            data-type={types[0]}
            onClick={readonly ? () => { } : () => selectPokemon(id)}
        >
            <h3>{name}
                {!readonly && <button onClick={() => setFavorite(id)}>
                    <img
                        className={styles[isFavorite ? "favorite" : ""]}
                        src={pokeball}
                        alt={`favorite_${isFavorite}`}
                    />
                </button>}
            </h3>
            <ul>
                {types.map((type: string, index: number) => (
                    <li key={index + type + id}>
                        <Tag label={type} parentMainType={types[0]} />
                    </li>
                ))}
            </ul>
            <img src={image} alt={name} />
        </article >
    )
}
