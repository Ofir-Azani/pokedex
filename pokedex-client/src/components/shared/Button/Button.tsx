import { FC, MouseEventHandler, ReactNode } from "react";
import styles from "./Buttons.module.css";

interface ButtonProps {
    label?: string;
    child?: ReactNode
    clickHandler: MouseEventHandler<HTMLButtonElement>;
}
export const Button: FC<ButtonProps> = ({ label, child, clickHandler }) => {
    return (
        <button className={`${styles["button"]} ${styles[child?"wrapper":""]}`} onClick={clickHandler}>
            {label||child}
        </button>
    )
}