const express = require('express');
const route = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const app = new express();
app.use(express.json());

const secretKey = 'secret_key';


route.post('/', async (req, res) => {

    const { username, password } = req.body;
    // console.log('username', username);
    // console.log('password', password);      
    // console.log(req.body)   

    try {

        const user = await db.query('SELECT username, password, user_type FROM users WHERE username = $1', username);

        if (user.length == 0) {
            res.status(404).json({ "message": "Invalid credentials. Please try again." });
        }
        else if (!(password == user[0].password)) {
            res.status(401).json({ "message": "Wrong username or password. Please try again." });
        }
        else {
            const token = jwt.sign({ "username": user[0].username, "user_type": user[0].user_type }, secretKey);
            //console.log(token);
            res.status(200).json({ "message": "Log in successfully", "user_type": user[0].user_type, "token": token });
        }
    }
    catch (e) {
        console.log(e)
    }
})


module.exports = route;