export const query = `
SELECT *
    FROM tag
    WHERE tag_id = ?
        AND question_id = ?;`