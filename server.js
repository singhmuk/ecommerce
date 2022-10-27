require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const dbConn = require('./config/db')
const productRoures = require('./routes/products');
const categoryRoures = require('./routes/category');
const usertRoures = require('./routes/user');
const orderRoures = require('./routes/order');
const authJwt = require('./helpers/jwt_auth');


dbConn;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());

//middleware
// app.use(authJwt());

const api = process.env.API_URL; 
app.use(`${api}/products`, productRoures);
app.use(`${api}/category`, categoryRoures);
app.use(`${api}/users`, usertRoures);
app.use(`${api}/orders`, orderRoures);

const port = process.env.PORT;

app.listen(port, ()=>console.log(`Server is running on port ${port}`))