export type PokemonType =
    "normal"
    | "grass"
    | "fire"
    | "water"
    | "electric"
    | "ice"
    | "fighting"
    | "poison"
    | "ground"
    | "flying"
    | "psychic"
    | "bug"
    | "rock"
    | "ghost"
    | "dragon"
    | "dark"
    | "steel"
    | "fairy"

export type FilteredTypes = {
    [key in PokemonType]: boolean
}