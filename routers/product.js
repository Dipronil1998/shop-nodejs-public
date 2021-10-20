const Product = require("../model/product");
const express = require('express');

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifytoken");

const router = new express.Router();
router.use(express.json({}));

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'-'+file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5  //5 mb file
    },
    fileFilter: fileFilter
});

router.post("/", verifyTokenAndAdmin, upload.single('img'),async (req, res) => {
    // const newProduct = new Product(req.body);
    const newProduct = new Product({
        title:req.body.title,
        desc:req.body.desc,
        img:req.file.path,
        categories:req.body.categories,
        size:req.body.size,
        color:req.body.color,
        price:req.body.price,
    });
    try {
        const savedProduct = await newProduct.save();
        // console.log(savedProduct);
        res.status(200).json({ "msg": "Product save Successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});


//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const _id = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(
            { "_id": _id },
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ "msg": "Product update successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deleteProduct) {
            res.status(404).json({ "msg": "Product doesnot exist" });
        } else {
            res.status(200).json({ "msg": "Product has been deleted..." });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get("/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const product = await Product.findById({ "_id": _id });
        if (!product) {
            res.status(404).json({ "msg": "productdoes not exists" });
        } else {
            res.status(200).json(product);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS
// router.get("/", async (req, res) => {
//     const qNew = req.query.new;
//     const qCategory = req.query.category;
//     try {
//       let products;
  
//       if (qNew) {
//         products = await Product.find().sort({ createdAt: -1 }).limit(1);
//       } else if (qCategory) {
//         products = await Product.find({
//           categories: {
//             $in: [qCategory],
//           },
//         });
//       } else {
//         products = await Product.find();
//       }
  
//       res.status(200).json(products);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   })



module.exports = router;
