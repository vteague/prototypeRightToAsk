export const query = `
CREATE TABLE IF NOT EXISTS links (
    id SERIAL,
    question_id int  NOT NULL,
    link varchar(128)  NOT NULL,
    CONSTRAINT links_pk PRIMARY KEY (id)
);`