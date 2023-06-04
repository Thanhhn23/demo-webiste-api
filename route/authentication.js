const express = require('express');
const route = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const app = new express();
app.use(express.json());


route.get('/', async (req, res, next) => {

    try {
        const user = req.user;

        res.status(200).json(user)
    }
    catch (e) {
        console.log(e)
    }
})

module.exports = route;