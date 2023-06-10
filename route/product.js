const express = require('express');
const route = express.Router();
const db = require('../db');
const { now } = require('lodash');
const Redis = require("ioredis");

const client = new Redis({
    password: 'QVcbtNKhScpw9lwadvWISSqrsqqStDay',
    host: 'redis-18027.c13.us-east-1-3.ec2.cloud.redislabs.com',
    port: 18027
});


const getProducts = async (page, limit) => {
    const actualOffset = (parseInt(page) -1) * parseInt(limit);
    //console.log(actualOffset)
    const result = await db.query('SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2', [limit, actualOffset]);
    return result;
}

const getAllProducts = async () => {
    return new Promise((resolve, reject) => {
        const cacheKey = 'products';
        client.get(cacheKey, async (err, data) => {
            if (err) {
                console.log('Fail to retrieve data from cache', err);
                resolve(fetchAllProducts());
            }
            else if (data) {
                //console.log('Data retrieved from cache successfully');
                resolve(JSON.parse(data));
            }
            else {
                try {
                    const products = await fetchAllProducts();
                    //console.log('Data retrieved from database');
                    client.set(cacheKey, JSON.stringify(products));
                    resolve(products);
                }
                catch (e) {
                    reject(e);
                }
            }
        })
        
    })
}

const fetchAllProducts = async () => {
    const result = await db.any('SELECT * FROM products');
    //console.log('Get All Products');
    return result;
}

const getDetailProduct = async (id) => {
    return new Promise((resolve, reject) => {
        const cacheKey = `products/${id}`;
        client.get(cacheKey, async (err, data) => {
            if (err) {
                //console.log('Fail to retrieve data from cache');
                resolve(fetchDetailProduct(id));

            }
            else if (data) {
                //console.log('Data retrieved from cache successfully');
                resolve(JSON.parse(data));
            }
            else {
                const product = await fetchDetailProduct(id);
                client.set(cacheKey, JSON.stringify(product));
                //console.log('Data retrieved from database');
                resolve(product);
            }
        })
        
    });
}


const fetchDetailProduct = async (id) => {
    const result = await db.query('SELECT * FROM products where id = $1', id);
    //console.log('Get Product Detail');
    return result
}

const getSearchProduct = async (keyword) => {
    const result = await db.query(`SELECT * FROM products WHERE LOWER(unaccent(name)) LIKE LOWER(unaccent($1))`, [`%${keyword}%`])
    return result
}

const getProductWithSearch = async (page, limit, keyword) => {
    const actualOffset = (parseInt(page) -1) * parseInt(limit);
    //console.log(actualOffset)
    const result = await db.query('SELECT * FROM products WHERE LOWER(unaccent(name)) LIKE LOWER(unaccent($1)) ORDER BY id ASC LIMIT $2 OFFSET $3', [`%${keyword}%`, limit, actualOffset]);
    return result;
}

const getCategoryProduct = async (category) => {
    console.log(category);
    const result = await db.query(`SELECT * FROM products WHERE category ILIKE $1;`, [`%${category}%`])
    return result
}

route.get('/', async (req, res) => {
    const { page, limit, search, category, from_price, to_price } = req.query;
    try {

        if (from_price && to_price && page && limit) {
            const actualOffset = (parseInt(page) -1) * parseInt(limit);
            const result = await db.query(`SELECT * FROM products WHERE current_price BETWEEN $1 AND $2 ORDER BY id ASC LIMIT $3 OFFSET $4`, [from_price, to_price, limit, actualOffset]);
            return res.status(200).json(result);
        }
        else if (from_price && to_price) {

            const result = await db.query(`SELECT * FROM products WHERE current_price BETWEEN $1 AND $2 `, [from_price, to_price]);
            return res.status(200).json(result);
        };

        if (!page && !limit && !search & !category) {
            const products = await getAllProducts();
            //console.log(products);
            res.status(200).json(products);
        }
        else if (page && limit && !search) {
            const products = await getProducts(page, limit);
            res.status(200).json(products);
        }
        else if (search && page && limit && !category) {
            const products = await getProductWithSearch(page, limit, search);
            //console.log('reached here', search)
            res.status(200).json(products);
        }
        else if (search && !page && !limit && !category) {
            const products = await getSearchProduct(search);
            res.status(200).json(products);
        }
        else if (category && !page && !limit && !search) {
            const products = await getCategoryProduct(category);
            res.status(200).json(products);
        }

        else {
            //console.log(page, limit, search)
            res.status(400).send('Error when fetching data.Please try again')
        }
    }
    catch (e) {
        console.log('Error ', e);
        res.status(500).send('Internal Server Error');

    }
})

route.get('/:id', async (req, res) => {
    const id = req.params.id;
    //console.log(id);
    const result = await db.oneOrNone('SELECT * FROM products WHERE id = $1', id);
    try {
        if (!result) {
            res.status(404).send('Cannot find product')
        }
        else {
            const product = await getDetailProduct(id);
            res.status(200).json(product)
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Internal Server Error')
    }

})

route.post('/', async (req, res) => {
    try {
        const { id, name, price, url, fromPrice, toPrice, originalPrice, category, image_url } = req.body;

        if (fromPrice && toPrice) {
            const result = await db.query(`SELECT * FROM products WHERE current_price BETWEEN $1 AND $2`, [fromPrice, toPrice])
            return res.status(200).json(result);
        };

        if (!(req.user.user_type == "admin")) {
            return res.status(401).json({ message: "You don't have the permisson" })
        }



        if (!id) {
            res.status(400).send('Invalid data input.Please try again')
        }
        else {
            const result = await db.one('INSERT INTO products (id, name, current_price, original_price, page_url, category, image_url, created_date, last_modified_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *', [id, name, price, originalPrice, url, category, image_url, new Date(), new Date()]);
            client.del('products')
                .then(count => console.log(`Delete ${count} entry of cache key products`))
                .catch(e => console.log(e));
            
            res.status(201).json(result);
            //console.log(result);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Intenal Server Error');
    }
})

route.put('/:id', async (req, res) => {
    try {
        if (!(req.user.user_type == "admin")) {
            return res.status(401).json({ message: "You don't have the permisson" })
        }
        const id = req.params.id;
        const { name, current_price, original_price, category, image_url, page_url, last_modified_date } = req.body;
        const existingProduct = await db.oneOrNone('SELECT * FROM products where id = $1', id);
        if (!existingProduct) {
            res.status(404).send('Product not found');
        }
        else {
            const updatedProduct = await db.one('UPDATE products SET name = $1, current_price = $2, original_price = $3, category = $4, image_url = $5, page_url = $6, last_modified_date = $7   where id = $8 RETURNING *', [name, current_price, original_price, category, image_url, page_url, last_modified_date, id]);
            client.del(`products/${id}`)
                .then(count => console.log(`Delete ${count} entry of cache key products`))
                .catch(e => console.log(e));
            
            res.status(200).json(updatedProduct);
            //console.log(updatedProduct);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
})

route.delete('/:id', async (req, res) => {
    try {
        if (!(req.user.user_type == "admin")) {
            return res.status(401).json({ message: "You don't have the permisson" })
        }
        const id = req.params.id;

        const result = await db.oneOrNone('SELECT * FROM products WHERE id = $1', id);
        if (result) {
            await db.none('DELETE FROM products WHERE id = $1', id);
            client.del('products')
                .then(count => console.log(`Delete ${count} entry of cache key products`))
                .catch(e => console.log(e));
            
            res.status(200).send('Success')
        }
        else {
            res.status(404).send('Product not found');
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
})


module.exports = route;