const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'thanhcong2204',
    port: '5432'
});


pool.query(`
  COPY customers(name, email, phone, address) 
  FROM './customers.csv' 
  DELIMITER ',' 
  CSV HEADER;
`).then(() => {
  console.log('CSV file imported to table successfully');
}).catch(err => {
  console.error('Error importing CSV file to table', err);
}).finally(() => {
  pool.end();
});
