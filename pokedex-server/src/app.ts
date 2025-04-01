import express from "express";
import cors from "cors";
import pokemonsRouter from "./api/v1/pokemons";
import { Client } from "pg";

const app = (db:Client) => {

    const pokedexServer = express();

    pokedexServer.use(cors());

    pokedexServer.use(express.json());

    pokedexServer.use('/v1/pokemons', pokemonsRouter)

    return pokedexServer
}

export default app;