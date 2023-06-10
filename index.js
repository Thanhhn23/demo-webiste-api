const express  = require('express');
const cors = require('cors');
const productRoute = require('./route/product');
const customerRoute = require('./route/customer');
const orderRoute = require('./route/order');
const uploadImage = require('./route/uploadImage');
const login = require('./route/login');
const authentication = require('./route/authentication');
const path = require("path");
const { authenticateUser } = require('./middle');
const app = new express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000', 'https://demo-website-ui-thanhhn23.vercel.app/*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/api/v1/products', authenticateUser, productRoute);

app.use('/api/v1/customers', authenticateUser, customerRoute);

app.use('/api/v1/orders', authenticateUser, orderRoute);

app.use('/api/v1/upload', authenticateUser, uploadImage);

app.use('/api/v1/users', login);

app.use('/api/v1/authenticate', authenticateUser, authentication);


app.get('/', (req, res) => {
    console.log('Hello')
    res.status(200).send('Hello anh Hoang service')
})

app.listen(5000, () => {
    console.log('Server listening on portal 5000')
})

module.exports = app;