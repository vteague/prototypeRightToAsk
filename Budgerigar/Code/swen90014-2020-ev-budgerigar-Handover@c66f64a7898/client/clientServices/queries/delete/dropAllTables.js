export const query = `
    PRAGMA foreign_keys = OFF;
    DROP TABLE IF EXISTS tag;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS links;
    DROP TABLE IF EXISTS answers;
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS users;
    PRAGMA foreign_keys = ON;
    ;`