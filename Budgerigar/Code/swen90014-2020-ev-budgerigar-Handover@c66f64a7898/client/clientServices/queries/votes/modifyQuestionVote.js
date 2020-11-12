export const query = `
UPDATE questions
SET user_vote = ?
WHERE id = ?; 
`
