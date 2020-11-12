export const query = `
UPDATE users
    SET email = ?
    WHERE id = ?;`