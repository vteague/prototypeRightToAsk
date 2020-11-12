const { Pool } = require('pg');

var pool;
try {
    if (process.env.NODE_ENV === 'test') {
        pool = new Pool({
            user: process.env.TEST_DB_USER,
            host: process.env.TEST_DB_HOST, 
            database: process.env.TEST_DB_NAME,
            password: process.env.TEST_DB_PASSWORD,
            port: process.env.TEST_DB_PORT,
            max: process.env.TEST_DB_CONNECTIONS_MAX,
        });

    } else {
        pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST, 
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            max: process.env.DB_CONNECTIONS_MAX,
        });
    }
} catch (err) {
    console.log(err);
}

module.exports = pool;