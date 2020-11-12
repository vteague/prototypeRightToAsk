export const query = `
SELECT tags.tag as name, tag.tag_id as tagid, COUNT(tag.tag_id) as count FROM questions
INNER JOIN tag
ON tag.question_id = questions.id
LEFT JOIN tags
ON tags.id = tag.tag_id
GROUP BY tags.tag, tag.tag_id;`
