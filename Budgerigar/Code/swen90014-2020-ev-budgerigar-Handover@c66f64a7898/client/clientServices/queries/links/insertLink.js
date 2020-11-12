export const query = `
INSERT OR REPLACE INTO links(id, question_id, link) VALUES(?, ?, ?);`