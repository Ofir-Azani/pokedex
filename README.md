# Pokedex Project

A full-stack project that fetches and preloads the first 150 Pokémon from the [PokéAPI](https://pokeapi.co), stores them in PostgreSQL, and serves them to a minimal frontend. This project emphasizes simplicity, clean architecture, and clarity of thought over reliance on libraries.

---

## Features

- **Data Preloading**  
  Automatically fetches Pokémon, types, abilities, and evolution chains from PokéAPI on startup.

- **PostgreSQL Database**  
  Stores:
  - `pokemons` with types, abilities, level
  - `evolutions` with level requirements
  - `favorites` linked to user
  - `users`, `types`, and `abilities`

- **Backend (Node + Express + Typescript)**  
  - `GET v1/pokemons`: List all Pokémon
  - Clean separation of concerns (controllers, services, routes)
  - Uses native `pg` module for DB access

- **Frontend (Vite + TypeScript + React)**  
  - Displays all Pokémon in a semi-responsive layout
  - Simple search input and type filter
  - Favorites UI in progress (relationship stored in DB, partially wired up)

---

## Tech Overview

- **Database Modeling**  
  Normalized structure with join tables (`pokemon_types`, `pokemon_abilities`) and evolution paths (including level).

- **Code Architecture**
  - Separation of concerns (SOC)
  - Minimal abstraction
  - No ORMs or utility libraries — everything is explicit to demonstrate reasoning

- **What’s intentionally covered**
  - Data modeling & DB structure
  - Evolution level logic
  - Efficient preload process
  - Clean backend & frontend separation

- **What’s intentionally _not_ covered**
  - Virtualization or lazy rendering for large lists
  - Pagination or infinite scroll
  - UI libraries or design systems
  - Favorites logic started but not fully connected on UI side

---

## 🚀 Running Locally

**Requirements:** Docker + Docker Compose

```bash
docker-compose down -v
docker-compose up --build