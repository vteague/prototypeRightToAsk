INSERT INTO links(question_id, link) VALUES($1, $2)
    RETURNING *;