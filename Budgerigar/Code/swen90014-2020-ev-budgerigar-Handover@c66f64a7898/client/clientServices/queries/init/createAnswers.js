export const query = `CREATE TABLE IF NOT EXISTS answers (
    id SERIAL,
    question_id int  NOT NULL,
    user_id int  NOT NULL,
    message varchar(2048)  NOT NULL,
    up_votes int  NOT NULL DEFAULT 0,
    down_votes int  NOT NULL DEFAULT 0,
    user_vote int  NOT NULL DEFAULT 0,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_modified timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT answers_pk PRIMARY KEY (id)
);`