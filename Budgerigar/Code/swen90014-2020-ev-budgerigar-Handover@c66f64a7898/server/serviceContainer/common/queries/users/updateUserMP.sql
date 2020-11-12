UPDATE users
SET is_mp = $2
WHERE id = $1
RETURNING *;