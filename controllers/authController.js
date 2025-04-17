import User from '../models/usersModel.js';
import {doHash, doHashValidation} from '../utils/hashing.js';
import {signupSchema, signinSchema, hmacProcess} from '../middlewares/validator.js';
import jwt from 'jsonwebtoken';
import transport from '../middlewares/sendMail.js';
const signup = async (req, res)=>{
    const {email,password} = req.body;
    try{
        const {error, value} = signupSchema.validate({email,password});
        if(error){
            res.status(401).json({
                success: false,
                message: error.details[0].message
            });
        }
        const existingUser = await User.findOne({email});

        if(existingUser){
            res.status(401).json({
                success: false,
                message: 'User already exists!'
            });
        }

        const hashedPassword = await doHash(password, 12);
        const newUser = new User({
            email,
            password:hashedPassword
        });
        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success: true,
            message: 'Your account created successfully.',
            data: result
        });
    }catch(error){
        res.json({
            success: false,
            message: error.message
        });
    }
}

const signin = async (req, res)=>{
    const {email, password} = req.body;
    try{
    const {error, value} = signinSchema.validate({email,password});
    if(error){
        res.status(401).json({
            success: false,
            message: error.details[0].message
        })
    }
    const existingUser = await User.findOne({email}).select('+password');
        if(!existingUser){
            res.status(404).json({
                success: false,
                message: 'User does not exists!'
            });
        }
        const result = await doHashValidation(password, existingUser.password);
        if(!result){
            res.status(401).json({
                success: false,
                message: 'Invalid credentials!'
            });
        }
        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verfied: existingUser.verfied
        }, process.env.TOKEN_SECRET,{
            expiresIn: '8h'
        });
        res.cookie('Authorization', 'Bearer' + token, { expires: new Date(Date.now() + 8 * 3600000),httpOnly: process.env.MODE_ENV === 'production', secure: process.env.MODE_ENV === 'production'}).json({
            success: true,
            token,
            message: 'logged in successfully'
        })

    }catch(error){
        res.status(500).json({
            status: false,
            message: error.message 
        });
    }
}

const signout = async (req, res)=>{
    res.clearCookie('Authorization').status(200).json({
        success: true,
        message: 'logged out successfully'
    })
}

const sendVerificationCode = async (req, res)=>{
    const {email} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(!existingUser){
            res.status(401).json({
                success: false,
                message: 'User does not exists!'
            });
        }
        if(existingUser.verfied){
            res.status(400).json({
                success: false,
                message: 'You are already verified!'
            });
        }
        const codeValue = Math.floor(Math.random() * 1000000).toString();
        let info = await transport.sendMail({
            from: process.env.NODE_CODE_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: "verification code",
            html: '<h1>'+ codeValue +'</h2>'
        });
        if(info.accepted[0] === existingUser.email){
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_SECRET);
            existingUser.verficationCodeValidation = Date.now();
            await existingUser.save();
            res.status(200).json({
                status: true,
                message: 'Code sent!'
            })

        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const verifyVerificationCode = async (req, res)=>{
    const {email, providedCode} = req.body;
    try{
        const {error, value} = signinSchema.validate({email, password});
        if(error){
            res.status(401).json({
                success: false,
                message: error.details[0].message
            });
            
        }

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export {signup, signin, signout, sendVerificationCode};