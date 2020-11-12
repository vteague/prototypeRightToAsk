INSERT INTO tag(tag_id, question_id) VALUES($1, $2)
    RETURNING *;