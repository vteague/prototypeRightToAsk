export const query = `
SELECT * 
    FROM tags
        INNER JOIN tag ON tags.id = tag.tag_id
    WHERE tag.question_id = ?;`
