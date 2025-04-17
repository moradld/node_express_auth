import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const { verify } = jwt;
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required: [true,'Email is required!'],
        trim: true,
        unique: [true, 'Email must be unique!'],
        lowercase: true
    },
    password:{
        type: String,
        required: [true, "Password must be provided!"],
        trim: true,
        select: false,
    },
    verified:{
        type: Boolean,
        default: false
    },
    verificationCode:{
        type: String,
        select: false
    },
    verificationCodeValidation:{
        type: String,
        select: false
    },
    forgotPasswordCodeValidation:{
        type: String,
        select: false
    },
},{
    timestamps:true
});
const User = mongoose.model("User",userSchema)
export default User;