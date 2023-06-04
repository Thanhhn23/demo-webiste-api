const pgp = require('pg-promise')();
const db = pgp({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'thanhcong2204',
    port: '5432'

});

module.exports = db;