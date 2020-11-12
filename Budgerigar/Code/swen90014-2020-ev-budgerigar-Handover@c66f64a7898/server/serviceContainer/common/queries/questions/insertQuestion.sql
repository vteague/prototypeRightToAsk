INSERT INTO questions(user_id, message) VALUES($1, $2)
    RETURNING *;
