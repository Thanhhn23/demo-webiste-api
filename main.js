const crawl = require('./db');
const pgp = require('pg-promise')();
const express = require('express');


const app = new express();

const db = pgp(
  {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'thanhcong2204',
    port: '5432'
  }
)

const getProducts = async (offset, limit) => {
  // Calculate the actual offset value by subtracting 1, as SQL OFFSET is 0-based
  const actualOffset = (parseInt(offset) - 1) * parseInt(limit);
  //console.log('actual offset ', actualOffset)

  // Execute SQL query with LIMIT and OFFSET clauses
  const result = await db.query(`SELECT * FROM products LIMIT $1 OFFSET $2`, [limit, actualOffset]);
  //console.log('result ', result);

  return result;
}

const getAllProducts = async () => {
  const result = await db.query('SELECT * FROM products')
  //console.log(result)
  return result;
}


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hi')
})


app.get('/api/v1/products', async (req, res) => {
  const { offset, limit } = req.query;
  try {
    if (!offset && !limit) {
      const products = await getAllProducts();
      //console.log(products)
      res.status(200).json(products)
    }
    else if (offset && limit) {
      const products = await getProducts(offset, limit)
      res.status(200).json(products)
    }
    else {
      res.status(500).send('Error when fetching data')
    }
  }
  catch (e) {
    res.status(500).send('Internal Server Error')
  }
  //  finally{
  //   console.log('Done')
  //  }


})

app.post('/api/v1/products', async (req, res, next) => {

  try {
    const { id, name, url, price } = req.body;
    if (!id || !name || !url || !price) {
      res.status(400).send('Invalid data')
    }
    else {
      const result = await db.one('INSERT INTO products(id, name, url,price) VALUES($1,$2,$3,$4) RETURNING *', [id, name, url, price]);
      res.status(201).json(result);
    }
  }
  catch (e) {
    console.log(e);
    res.status(500).send('Internal Server Error')
  }
})





app.listen(5000, () => {
  console.log('Server listening on portal 5000');
})



