# Pokedex Project

A full-stack project that fetches and preloads the first 150 Pokémon from the [PokéAPI](https://pokeapi.co), stores them in PostgreSQL, and serves them to a minimal frontend. This project emphasizes simplicity, clean architecture, and clarity of thought over reliance on libraries.

---

## Features

- *Data Preloading*  
  Automatically fetches Pokémon, types, abilities, and evolution chains from PokéAPI on startup.

- *PostgreSQL Database*  
  Stores:
  - pokemons with types, abilities, level
  - evolutions with level requirements
  - favorites linked to user
  - users, types, and abilities

- *Backend (Node + Express + TypeScript)*  
  - GET v1/pokemons: List all Pokémon
  - Clean separation of concerns (controllers, services, routes)
  - Uses native pg module for DB access

- *Frontend (Vite + TypeScript + React)*  
  - Displays all Pokémon in a responsive layout
  - Simple search input and type filter
  - Favorites UI in progress (relationship stored in DB, partially wired up)

---

## Tech Overview

- *Database Modeling*  
  Normalized structure with join tables (pokemon_types, pokemon_abilities) and evolution paths (including level).

- *Code Architecture*
  - Separation of concerns (SOC)
  - Minimal abstraction
  - No ORMs or utility libraries — everything is explicit to demonstrate reasoning

- *What’s intentionally covered*
  - Data modeling & DB structure
  - Evolution level logic
  - Efficient preload process
  - Clean backend & frontend separation

- *What’s intentionally not covered*
  - Virtualization or lazy rendering for large lists
  - Pagination or infinite scroll
  - UI libraries or design systems
  - Favorites and Evolutions logic started but not fully connected on UI side

---

## 🚀 How to Run (First Time)

### 🧰 Pre-requisites

- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/)
- Internet connection (first-time PokéAPI preload)

### 📦 Start the app

bash
docker-compose down -v     # optional: reset db
docker-compose up --build


This will:

1. Start PostgreSQL and preload schema
2. Fetch & store the first 150 Pokémon (types, abilities, evolutions)
3. Start the backend (port 3000)
4. Start the frontend (port 5173)

---

## ⏳ Startup Timing Notes

> ⚠️ The *frontend may be available before the backend* has finished preloading. This is expected.

- The app *does not yet handle this race condition*
- Just wait until you see this in your terminal:

bash
Preloading complete!
running on port 3000


Then open your browser:  
👉 http://localhost:5173

---

## 🧪 Example API Request

bash
GET http://localhost:3000/v1/pokemons


Returns:
json
[
  {
    "id": 1,
    "name": "bulbasaur",
    "types": ["grass", "poison"],
    "abilities": ["overgrow"],
    "evolutions": [{ "to": 2, "level": 16 }]
  },
  ...
]


---

## 📌 Next Ideas

- [ ] Pagination (backend + frontend)
- [ ] List virtualization for better performance
- [ ] Complete favorite toggling in UI
- [ ] Add Pokémon detail views with full evolution trees
- [ ] Implement more PokéAPI endpoints (e.g. moves, stats, habitat)
- [ ] Proxy external PokéAPI requests through the backend to fetch live data beyond the preloaded 150

---

## 🤓 Why This Matters

This project is intentionally built with minimal tools to emphasize:
- Data modeling choices
- Backend reasoning
- Frontend structure
- Thinking clearly through each layer

It’s not “ready for production” — but it *is* ready for better understand of my approaches.