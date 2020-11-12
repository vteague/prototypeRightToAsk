export const query = `
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL,
    tag varchar(32)  NOT NULL,
    CONSTRAINT tags_pk PRIMARY KEY (id)
);`