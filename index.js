require('dotenv').config();
const express = require('express');
// const {sendMail}=require('./routers/mail')


require("./db/conn");   //database connection

//Define Model
const User = require("./model/user");
const Product = require("./model/product")
const Order = require("./model/order");
const Cart = require('./model/cart')

const app = express();
app.use(express.json({}));

port = process.env.PORT || 3000;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Router

const AuthRouter = require("./routers/auth");
app.use("/auth/", AuthRouter)

const UserRouter = require("./routers/user")
app.use("/users/", UserRouter)

const ProductRouter = require("./routers/product");
app.use("/products", ProductRouter)

const OrderRouter = require("./routers/order");
app.use("/orders", OrderRouter)

const CartRouter = require("./routers/cart");
app.use("/carts", CartRouter)


app.listen(port, () => {
    console.log(`Server is run: ${port}`);
})