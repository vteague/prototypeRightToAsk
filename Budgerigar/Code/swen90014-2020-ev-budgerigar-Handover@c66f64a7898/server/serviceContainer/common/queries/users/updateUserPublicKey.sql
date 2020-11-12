UPDATE users
SET public_key = $2
WHERE id = $1
RETURNING *;