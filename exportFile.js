const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'thanhcong2204',
    port: '5432'
});

async function exportData() {
  const client = await pool.connect();
  const query = 'SELECT * FROM products';
  const result = await client.query(query);

  const outputFilePath = './product.csv';
  const outputStream = fs.createWriteStream(outputFilePath);

  const columnNames = Object.keys(result.rows[0]);
  outputStream.write(`${columnNames.join(',')}\n`);

  result.rows.forEach((row) => {
    const values = columnNames.map((name) => row[name]);
    outputStream.write(`${values.join(',')}\n`);
  });

  outputStream.end();

  await client.release();
  console.log('Data exported successfully!');
}

exportData().catch((err) => console.error(err));