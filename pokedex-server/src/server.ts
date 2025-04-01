import http from "http";
import app from "./app";
import { Client } from "pg"

const DB_URL = process.env.DATABASE_URL;

const client = new Client({ connectionString: DB_URL });
const server = http.createServer(app(client));

client.connect().then(() => {
    server.listen(3000, () => console.log('running on port 3000'))
}).catch(err => {
    console.error('failed to connect to db')
})
