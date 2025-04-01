FROM node:20

WORKDIR /app

COPY package*.json './'
RUN apt-get update && apt-get install -y postgresql-client
RUN npm install

COPY . .

RUN npx tsc

EXPOSE 3000

CMD ["sh", "-c", "until pg_isready -h db -p 5432; do echo '⏳ Waiting for db...'; sleep 1; done; node dist/preload/preload-pokemons.js && node dist/server.js"]