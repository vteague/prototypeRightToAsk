export const query = `
Update answers SET 
    message = ?,
    up_votes = ?,
    down_votes = ?,
    last_modified = ?
WHERE id=?;`
