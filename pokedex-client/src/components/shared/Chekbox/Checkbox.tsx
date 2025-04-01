import { ChangeEventHandler, FC } from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
    type: string;
    handleTypeFilter: ChangeEventHandler<HTMLInputElement>

}
export const Checkbox:FC<CheckboxProps> = ({type, handleTypeFilter}) => {
    return (
        <label className={styles["checkbox"]}>
            <input type="checkbox" value={type} onChange={handleTypeFilter} />
            <div className={styles["checkmark"]} />
            {type}
        </label>
    )
}

