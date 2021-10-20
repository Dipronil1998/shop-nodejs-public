const Order = require("../model/order");
const express = require('express');

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifytoken");

const router = new express.Router();
router.use(express.json({}));


// create order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    // console.log(savedOrder);
    res.status(200).json({ "msg": "order successfull" });
  } catch (err) {
    res.status(500).json({ "msg": "order failure" });
  }
});


// update order
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const _id = req.params.id;
    const updateOrder = await Order.findByIdAndUpdate({ '_id': _id }, req.body, {
      new: true
    });
    res.status(200).json({ "msg": "Order Update Successfully" });
  } catch (error) {
    res.status(404).send(error);
  }
})


//delete order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const _id = req.params.id;
    await Order.findByIdAndDelete({"_id":_id});
    res.status(200).json({"msg":"Order has been deleted..."});
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET USER ORDERS
router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});


//get all
router.get('/',verifyTokenAndAdmin, async (req, res) => {
  try {
      const orders = await Order.find();
      res.status(201).send(orders);
  } catch (error) {
      res.status(400).send(error);
  }

})


module.exports = router;
