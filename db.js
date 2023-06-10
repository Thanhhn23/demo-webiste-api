const pgp = require('pg-promise')();
const db = pgp({
    user: 'thanhhn',
    host: 'ep-morning-fire-195316.us-east-1.aws.neon.tech',
    database: 'neondb',
    password: 'M8eok4YFdcIE',
    port: '5432',
    ssl: {
        rejectUnauthorized: false 
    }

});

module.exports = db;