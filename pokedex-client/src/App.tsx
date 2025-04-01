import { useState } from "react";
import styles from "./App.module.css";
import { PokemonCardGrid } from "./components/PokemonCardGrid/PokemonCardGrid";
import { usePokemons } from "./context/PokemonProvider";
import { PokemonData } from "./components/PokemonData";
import PokemonFilters from "./components/PokemonFilters/PokemonFilters";
import Favorites from "./components/Favorites/Favorites";

export const App = () => {

  const { selectedPokemonId, searchPokemon } = usePokemons();
  const [sidebarContent, setSidebarContent] = useState<string | undefined>(undefined);

  const handleSidebarOpen = (content: string) => {
    const newSidebarContent = sidebarContent === content ? undefined : content;
    setSidebarContent(newSidebarContent)
  }

  const isSidebarOpen = typeof sidebarContent !== "undefined";
  const isDrawerOpen = typeof selectedPokemonId !== "undefined";

  return (
    <div className={styles["layout"]}>
      <header>
        <div className={styles["header-mains"]}>
          <button onClick={() => handleSidebarOpen("filter")}>&#9776; filter</button>
          <h1>Pokedex</h1>
          <label>
            <input type="text" placeholder={"Search pokemons"}className={styles["searchbar"]} onChange={(e) => searchPokemon(e.target.value)} />
          </label>
        </div>
        <button onClick={() => handleSidebarOpen("favorites")}>My Pokemons</button>
      </header>
      <div>
        <aside data-open={`${isSidebarOpen}`}>
          {sidebarContent === "favorites"
            ? <Favorites />
            : <PokemonFilters
            />}
        </aside>

        <main
          className={`
        ${styles[isSidebarOpen ? "shrink-left" : ""]} 
        ${styles[isDrawerOpen ? "shrink-right" : ""]}
        `}>
          <PokemonCardGrid />
        </main>
        <div
          className={styles["drawer"]}
          data-open={`${isDrawerOpen}`}
        >
          <PokemonData />
        </div>
      </div>
    </div>
  )
}

export default App;