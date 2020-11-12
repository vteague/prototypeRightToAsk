INSERT INTO users(username, public_key) VALUES($1, $2)
    RETURNING *;