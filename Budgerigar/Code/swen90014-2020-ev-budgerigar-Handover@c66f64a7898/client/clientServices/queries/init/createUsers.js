export const query = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL,
    is_mp boolean NOT NULL DEFAULT FALSE,
    username varchar(128)  NOT NULL,
    public_key varchar(512)  NOT NULL,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pk PRIMARY KEY (id)
);`