const User = require("../model/user");
const express = require('express');
const bcrypt = require('bcrypt');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifytoken");

const router = new express.Router();
router.use(express.json({}));



//change password
router.put("/changepassword/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        if (req.body.password) {
            const emailuser = await User.findOne({ "_id": req.params.id });
            const isValid = await bcrypt.compare(req.body.oldpassword, emailuser.password);
            if (isValid) {
                if (req.body.password === req.body.password1) {
                    req.body.password = await bcrypt.hash(req.body.password, 12);
                    req.body.password1 = await bcrypt.hash(req.body.password1, 12);
                    const changePassword = await User.findByIdAndUpdate(req.params.id, req.body,
                        { new: true }
                    );
                    res.status(200).json({ "msg": "Password Change Successfully" });
                } else {
                    res.status(500).json({ "msg": "Password and Confirm Password Does not match" })
                }
            } else {
                res.status(500).json({ "msg": "Old Password does not match" })
            }
        }
    } catch (error) {
        res.status(500).send(error)
    }

})


//update user profile
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password || req.body.password1) {
        return res.status(500).json({ "msg": "Yor are not change password here" })
        // exit()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body,
            { new: true }
        );
        res.status(200).json({ "msg": "user update successfully" });
    } catch (error) {
        res.status(500).send(error)
    }
});

//delete user
router.delete("/userdelete/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ "msg": "User has been deleted" })
    } catch (err) {
        res.status(500).send(err)
    }
})

//get particular user
router.get("/finduser/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const _id = req.params.id;
        console.log(_id);
        const user = await User.findById({ '_id': _id });
        if (!user) {
            res.json({ "msg": "user does not exist" })
        } else {
            const { password, password1, ...other } = user._doc;
            res.status(200).send(other);
        }

    } catch (error) {
        res.status(500).send(error);
    }
})

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(1) : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;

