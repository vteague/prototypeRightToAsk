export const query = `
INSERT OR REPLACE INTO questions(id, user_id, message, up_votes, down_votes, date_created, last_modified) VALUES(?, ?, ?, ?, ?, ?, ?);`