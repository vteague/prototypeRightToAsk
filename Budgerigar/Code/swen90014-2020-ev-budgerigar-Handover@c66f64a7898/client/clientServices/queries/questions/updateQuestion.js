export const query = `
Update questions SET 
    message = ?,
    up_votes = ?,
    down_votes = ?,
    last_modified = ?
WHERE id=?;`
