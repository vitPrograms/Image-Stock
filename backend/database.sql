
create TABLE image(
    id SERIAL PRIMARY KEY,
    lastModified bigint,
    name VARCHAR(255),
    size bigint,
    type VARCHAR(255),
    base64src text
);