export const query = `
UPDATE users
    SET is_mp = ?
    WHERE id = ?;`
