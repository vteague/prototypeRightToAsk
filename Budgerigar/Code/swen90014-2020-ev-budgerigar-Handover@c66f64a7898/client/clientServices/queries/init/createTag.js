export const query = `
CREATE TABLE IF NOT EXISTS tag (
    tag_id int  NOT NULL,
    question_id int  NOT NULL,
    CONSTRAINT tag_pk PRIMARY KEY (tag_id,question_id)
);`