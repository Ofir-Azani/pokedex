import { FC } from "react";
import styles from "./Tag.module.css";
import { PokemonType } from "../PokemonFilters/types";

interface TagProps {
    label: string;
    parentMainType: PokemonType;
}

export const Tag:FC<TagProps> = ({label, parentMainType}) => {
    return (
        <span className={styles["tag"]} data-type={parentMainType}>{label}</span>
    )
}