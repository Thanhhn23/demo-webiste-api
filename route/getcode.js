const express = require('express');
const route = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const app = new express();
app.use(express.json());

route.post('/', async (req,res) => {
    res.status(404).json({messsage:'fail'})
})


module.exports = route

