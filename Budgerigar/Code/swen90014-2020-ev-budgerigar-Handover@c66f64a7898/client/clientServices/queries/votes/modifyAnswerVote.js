export const query = `
UPDATE answers
SET user_vote = ?
WHERE id = ?; 
`
