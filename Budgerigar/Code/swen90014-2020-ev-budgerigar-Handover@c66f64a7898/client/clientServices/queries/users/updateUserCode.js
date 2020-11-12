export const query = `
UPDATE users
    SET verification_code = ?
    WHERE id = ?;`