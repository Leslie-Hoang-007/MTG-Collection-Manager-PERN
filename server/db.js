const Pool = require('pg').Pool;

const pool = new Pool({
    user:"postgres",
    password: "Oneofone1",
    host: "localhost",
    port: 5432,
    database: "mtg"
});

module.exports = pool;