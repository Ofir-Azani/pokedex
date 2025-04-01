-- Drop existing tables (in dependency order)
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS evolutions;
DROP TABLE IF EXISTS pokemon_abilities;
DROP TABLE IF EXISTS pokemon_types;
DROP TABLE IF EXISTS pokemons;
DROP TABLE IF EXISTS abilities;
DROP TABLE IF EXISTS types;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL
);

-- Types table
CREATE TABLE types (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Abilities table
CREATE TABLE abilities (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Pokémons table
CREATE TABLE pokemons (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    image TEXT NOT NULL,
    level INTEGER NOT NULL
);

-- Many-to-Many: Pokémon <-> Types
CREATE TABLE pokemon_types (
    pokemon_id INTEGER REFERENCES pokemons(id) ON DELETE CASCADE,
    type_id INTEGER REFERENCES types(id) ON DELETE CASCADE,
    PRIMARY KEY (pokemon_id, type_id)
);

-- Many-to-Many: Pokémon <-> Abilities
CREATE TABLE pokemon_abilities (
    pokemon_id INTEGER REFERENCES pokemons(id) ON DELETE CASCADE,
    ability_id INTEGER REFERENCES abilities(id) ON DELETE CASCADE,
    PRIMARY KEY (pokemon_id, ability_id)
);

-- Evolutions table (Many-to-Many, allows branching evolutions)
CREATE TABLE evolutions (
    from_pokemon_id INTEGER REFERENCES pokemons(id) ON DELETE CASCADE,
    to_pokemon_id INTEGER REFERENCES pokemons(id) ON DELETE CASCADE,
    level INTEGER,
    PRIMARY KEY (from_pokemon_id, to_pokemon_id)
);

-- Favorites table (Many-to-Many: users <-> pokemons)
CREATE TABLE favorites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    pokemon_id INTEGER REFERENCES pokemons(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, pokemon_id)
);

-- Insert initial users
INSERT INTO users (username) VALUES ('UserA'), ('UserB');