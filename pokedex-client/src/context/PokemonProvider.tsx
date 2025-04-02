import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { PokemonType } from "../components/PokemonFilters/types";
import { PokemonCardProps } from "../components/PokemonCard";

const POKE_API = "api/v1/pokemons";

type PokemonEvolution = {
    to: number;
    level: number;
}
type Pokemon = {
    id: string;
    name: string;
    types: [PokemonType, ...PokemonType[]];
    image: string;
    abilities: [];
    evolution: PokemonEvolution[];
}

interface PokemonContextType {
    pokemons: Pokemon[];
    selectedPokemonId: string | undefined;
    visiblePokemons: Pokemon[];
    favorites: FavoriteList | undefined;
    pokemonTypes: PokemonType[];
    selectPokemon: (id: string) => void;
    deselectPokemon: () => void;
    filterByType: (types: PokemonType[] | "all") => void;
    addToFavorites: (id: string) => void;
    removeFromFavorites: (id: string) => void;
    searchPokemon: (searchValue: string | number) => void;
}

interface FavoriteList {
    [key: string | number]: boolean;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider = ({ children }: { children: ReactNode }) => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [selectedPokemonId, setSelectedPokemonId] = useState<string | undefined>(undefined);
    const [visiblePokemons, setVisiblePokemons] = useState<Pokemon[]>([]);
    const [favorites, setFavorites] = useState<FavoriteList | undefined>(undefined);

    const pokemonTypes: PokemonType[] = [
        "normal",
        "grass",
        "fire",
        "water",
        "electric",
        "ice",
        "fighting",
        "poison",
        "ground",
        "flying",
        "psychic",
        "bug",
        "rock",
        "ghost",
        "dragon",
        "dark",
        "steel",
        "fairy",
    ]

    useEffect(() => {
        const fetchPokemons = async () => {
            try{
                const pokemonResponse = await fetch(POKE_API);
                const pokemonDetails = await pokemonResponse.json();
    
                setPokemons(pokemonDetails);
                setVisiblePokemons(pokemonDetails);
            }
            catch (err) {
                console.error('No pokemon were found', err);
                setPokemons([]);
                setVisiblePokemons([]);
            }
        }

        const fetchFavorites = async () => {
            const favoritesFromLocalStorage = localStorage.getItem("favorite-pokemons");
            if (favoritesFromLocalStorage) {
                setFavorites(() => {
                    const favoritePokemonIds = JSON.parse(favoritesFromLocalStorage)
                    if (Array.isArray(favoritePokemonIds)) {
                        return favoritePokemonIds.reduce((acc, curr) => {
                            acc[curr] = true
                            return acc;
                        }, {})
                    }
                })
            } else {
                //fetch logic goes here
                return {};
            }
        }
        fetchPokemons();
        fetchFavorites();
    }, [])

    useEffect(() => {
        if (!favorites) return;
        const favoritePokemonIds = Object.keys(favorites);
        localStorage.setItem("favorite-pokemons", JSON.stringify(favoritePokemonIds));
    }, [favorites])

    const filterPokemons = (filterFunction: any) => {
        setVisiblePokemons(() => (
            pokemons.filter(filterFunction)
        ))
    }

    const filterByType = (types: PokemonType[] | "all") => {
        if (types === "all") {
            return (setVisiblePokemons([...pokemons]))
        }
        filterPokemons((p: PokemonCardProps) => {
            return types.some(t => p.types.includes(t))
        })
    }


    const selectPokemon = (pokemodId: string) => {
        if (selectedPokemonId === pokemodId) return;
        setSelectedPokemonId(pokemodId)
    }

    const addToFavorites = (pokemodId: string) => {
        setFavorites((prev) => ({
            ...prev,
            [pokemodId]: true
        }))
    }

    const removeFromFavorites = (pokemonId: string) => {
        setFavorites((prev) => {
            if (!prev) return;
            if (pokemonId in prev) {
                const prevCopy = { ...prev };
                delete prevCopy[pokemonId];
                return prevCopy;
            }
            return prev;
        })
    }

    const deselectPokemon = () => setSelectedPokemonId(undefined);

    const searchPokemon = (searchValue: string | number) => {
        if (typeof searchValue === "string" && searchValue.trim() === "") {
            setVisiblePokemons([...pokemons])
        } else if (!isNaN(+searchValue)) {
            filterPokemons((p: PokemonCardProps) => (
                p.id.toString().padStart(3, "0").includes(searchValue as string)
            ))
        } else {
            filterPokemons((p: PokemonCardProps) => (
                p.name.includes(searchValue as string)
            ))
        }
    }


    return (
        <PokemonContext.Provider
            value={{
                pokemons,
                selectedPokemonId,
                visiblePokemons,
                favorites,
                pokemonTypes,
                selectPokemon,
                deselectPokemon,
                filterByType,
                addToFavorites,
                removeFromFavorites,
                searchPokemon
            }}>
            {children}
        </PokemonContext.Provider>
    )
}

export const usePokemons = () => useContext(PokemonContext) as PokemonContextType