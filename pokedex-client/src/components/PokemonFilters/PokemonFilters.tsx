import { useEffect, useState } from "react";
import styles from "./PokemonFilters.module.css";
import { usePokemons } from "../../context/PokemonProvider";
import { Checkbox } from "../shared";
import { FilteredTypes, PokemonType } from "./types";

const PokemonFilters = () => {

    const { filterByType, pokemonTypes } = usePokemons();

    const [shouldDisplayAllTypes, setShouldDisplayAllTypes] = useState<boolean>(false);
    const [filteredValues, setFilteredValues] = useState<FilteredTypes>(() => (
        pokemonTypes.reduce((acc: FilteredTypes, curr: PokemonType) => {
            acc[curr] = false
            return acc;
        }, {} as FilteredTypes)
    ))

    useEffect(() => {
        const typesToFilter = Object.entries(filteredValues)
            .filter(([key, val]) => {
                if (val) {
                    return key
                }
            })
            .map(f => f[0]) as PokemonType[];

        filterByType(typesToFilter.length > 0 ? typesToFilter : "all")

    }, [filteredValues])

    const toggleDisplayAllTypes = () => setShouldDisplayAllTypes(!shouldDisplayAllTypes);

    const typesToDisplay: PokemonType[] = shouldDisplayAllTypes ? pokemonTypes : pokemonTypes.slice(0, 6);

    const handleTypeFilter = (e: any) => {
        const { value, checked } = e.target;
        setFilteredValues(prev => ({ ...prev, [value]: checked }))
    }

    return (
        <section>
            <div className={styles["pokemoon-filters_header"]}>
                <h2>Filters</h2>
                <button>Reset All</button>
            </div>
            <h4>Type</h4>
            <ul className={styles["pokemon-filters_list"]}>
                {typesToDisplay.map((type) => (
                    <li key={type}>
                        <Checkbox
                            type={type}
                            handleTypeFilter={handleTypeFilter}
                        />
                    </li>
                ))}
            </ul>
            <label className={styles["pokemon-filters_show-all"]}>
                <input
                    type="checkbox"
                    onChange={toggleDisplayAllTypes}
                />
                {`Show ${shouldDisplayAllTypes ? "less" : "more"} types`}
            </label>
        </section>
    )
}

export default PokemonFilters