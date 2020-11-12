UPDATE users
SET verification_code = $2
WHERE id = $1
RETURNING *;