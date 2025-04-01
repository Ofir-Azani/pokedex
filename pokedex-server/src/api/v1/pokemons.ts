import { Router, Request, Response } from "express";
import { getAllPokemons } from "../../services/pokemon/pokemonService";

const router = Router();

router.get('/', async (_: Request, res: Response) => {
    try {
        const pokemons = await getAllPokemons();
        res.status(200).send(JSON.stringify(pokemons))
    } catch (err) {

    }
})

export default router;