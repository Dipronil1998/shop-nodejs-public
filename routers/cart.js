const Cart = require("../model/cart");
const express = require('express');

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifytoken");

const router = new express.Router();
router.use(express.json({}));


//CREATE
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json({ "msg": "Cart add Successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

//update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const _id = req.params.id;
        const updatedCart = await Cart.findByIdAndUpdate({ '_id': _id }, req.body,
            { new: true }
        );
        res.status(200).json({ "msg": "Cart Update Successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE 
router.delete('/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const deleteCart = await Cart.findByIdAndDelete({ '_id': _id });
        if (!deleteCart) {
            res.status(404).json({"msg":"Cart is not exists"});
        } else {
            res.status(200).json({"msg":"Cart Remove Successfully"});
        }
    } catch (error) {
        res.status(500).send(error);
    }
})


//GET USER CART
router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // //GET ALL
  
  router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
      const carts = await Cart.find();
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;