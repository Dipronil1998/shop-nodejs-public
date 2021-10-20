const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true, "email is already exist"],
        validate(value) {
            if (!validator.isEmail(value)) {
                console.log("invalid email");
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: false,
      },
    password: {
        type: String,
        required: true
    },
    password1: {
        type: String,
        required: [true, "confirm password required"]
    }
},
{
    timestamps:true
})

userSchema.pre('save', async function (next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.password1 = await bcrypt.hash(this.password1, 12);
        // console.log(this.password);
    }
    next();
})

//generate token
userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ 
            _id: this._id,
            isAdmin:this.isAdmin
         }, 
        process.env.SECRET_KEY,
        {expiresIn:"1h"});
        await this.save();
        return token
    } catch (error) {
        console.log(error)
    }
}

const User = new mongoose.model('User', userSchema);
module.exports = User;