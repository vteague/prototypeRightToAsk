export const query = `
INSERT OR REPLACE INTO users(id, username, public_key, is_mp, date_created, last_modified) VALUES(?, ?, ?, ?, ?, ?);`