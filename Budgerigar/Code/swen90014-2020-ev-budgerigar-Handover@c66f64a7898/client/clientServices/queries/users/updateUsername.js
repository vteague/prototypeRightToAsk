export const query = `
UPDATE users
    SET username = ?
    WHERE id = ?;`