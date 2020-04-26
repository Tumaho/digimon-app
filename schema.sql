DROP TABLE IF EXISTS digimons;

CREATE TABLE digimons (
    id SERIAL PRIMARY KEY,
    name TEXT,
    img TEXT,
    level TEXT
);