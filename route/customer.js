const express = require('express');
const route = express.Router();
const db = require('../db');

route.get('/', async (req, res) => {
    try {
        if (!(req.user.user_type == "admin")) {
            return res.status(401).json({ message: "You don't have the permisson" })
        }
        const customers = await db.query('SELECT * FROM customers ORDER BY id')
        res.status(200).json(customers)
    }
    catch (e) {
        console.log('Error: ', e)
        res.status(500).send('Internal Server Error')
    }
})
route.get('/:id', async (req, res) => {
    try {
        if (!(req.user.user_type == "admin")) {
            return res.status(401).json({ message: "You don't have the permisson" })
        }
        const { id } = req.params
        const query = `SELECT c.id as customer_id,
        c.name as customer_name,
        o.id as order_id, 
        JSON_AGG(JSON_BUILD_OBJECT('product_id', p.id,'product_name', p.name, 'product_price', p.current_price, 'product_image', p.image_url, 'product_url', p.page_url, 'quantity', i.quantity)) AS product, 
        cast(sum(p.current_price * i.quantity) as float) as revenue
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id 
        LEFT JOIN order_items i ON i.order_id = o.id
        LEFT JOIN products p ON p.id = i.product_id
        WHERE c.id = $1
        GROUP BY c.id, c.name, o.id`

        const customer = await db.query(query, id)
        //const result = JSON.stringify(customer, null, 2)
        let products = [];
        let order_ids = [];
        let revenue = 0
        let customer_name
        let customer_id
        const orders = customer.map((order, index) => {
            order.product.forEach((product, i) => {
                products.push(product);
            });
            order_ids = order_ids.concat(order.order_id)
            customer_name = order.customer_name;
            customer_id = order.customer_id;
            revenue = revenue + order.revenue
            //console.log(order.revenue)
        });
        const result = {
            customer_id: customer_id,
            customer_name: customer_name,
            order_id: order_ids,
            product: products,
            revenue: revenue
        }

        if (!customer_id) {
            res.status(400).send('Customer not found')
        }
        else {
            //console.log(customer)
            res.status(200).json(result)
        }
    }
    catch (e) {
        console.log('Error: ', e)
        res.status(500).send('Internal Server Error')
    }
})


module.exports = route;