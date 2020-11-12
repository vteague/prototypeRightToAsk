export const query = `
INSERT OR REPLACE INTO tag(tag_id, question_id) VALUES(?, ?);`