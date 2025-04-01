import { usePokemons } from "../../context/PokemonProvider";
import { PokemonCard } from "../PokemonCard/PokemonCard";
import styles from "./PokemonCardGrid.module.css";

export const PokemonCardGrid = () => {

    const { visiblePokemons } = usePokemons();

    return (
        <section className={styles["pokemon-card-grid_container"]}>
            <ul className={styles["pokemon-card-grid_layout"]}>
                {visiblePokemons && visiblePokemons.map((i: any) => (
                    <li key={i.id}>
                        <PokemonCard
                            id={i.id}
                            name={i.name}
                            types={i.types}
                            image={i.image}
                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}