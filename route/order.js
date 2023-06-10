const express = require('express');
const route = express.Router();
const db = require('../db');

route.get('/', async (req, res) => {
    try {
        if (!(req.user.user_type == "admin")) {
            return res.status(401).json({ message: "You don't have the permisson" })
        }
        const orders = await db.query('SELECT * FROM orders ORDER BY id')
        res.status(200).json(orders)
    }
    catch (e) {
        console.log('Error: ', e)
        res.status(500).send('Internal Server Error')
    }
})


route.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        if (!(req.user.user_type == "admin")) {
            return res.status(401).json({ message: "You don't have the permisson" })
        }
        const query = `SELECT o.id as order_id, 
        c.name as customer_name, 
        JSON_AGG(JSON_BUILD_OBJECT('product_id', p.id,'product_name', p.name, 'product_price', p.current_price, 'product_image', p.image_url, 'product_url', p.page_url, 'quantity', i.quantity)) AS product, 
        cast(sum(p.current_price * i.quantity) as float) as revenue
        FROM orders o
        LEFT JOIN order_items i ON o.id = i.order_id 
        LEFT JOIN products p ON i.product_id = p.id
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE o.id = $1
        GROUP BY o.id, c.name     
        `
        const order = await db.oneOrNone(query, id)
        if (!order) {
            res.status(400).send('Order not found')
        }
        else {
            //console.log(customer)            
            res.status(200).json(order)
        }
    }
    catch (e) {
        console.log('Error: ', e)
        res.status(500).send('Internal Server Error')
    }
})




module.exports = route;