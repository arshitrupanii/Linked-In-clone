import User from '../model/user.model.js'
import bcrypt from 'bcryptjs';
import { response } from 'express';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const {name, username,email, password} = req.body;

        if(!name || !username || !password || !email){
            return res.status(400).json({msg: 'Please enter all fields'})
        }

        const existingusername = await User.findOne({username: username})
        if(existingusername){
            return res.status(400).json({msg: 'Username already exists'})
        }

        const existingEmail = await User.findOne({email: email})
        if(existingEmail){
            return res.status(400).json({msg: 'Email already exists'})
        }

        if(password.length < 8){
            return res.status(400).json({msg: "password is smaller than 8 characters"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            username,
            email,
            password: hashedPassword,
        })

        await user.save();

        const token = jwt.sign({userId : user._id }, process.env.JWT_TOKEN, {expiresIn: "3d"})
        res.cookie("jwt_LinkedIn_token", token, {
            httpOnly: true,
            maxAge : 3 * 24 * 60 * 60 * 1000,
            sameSite: true,
            secure: process.env.NODE_ENV === "production",
        })

        res.status(201).json({message : 'user is Created successfully'})

    } catch (error) {
        console.error("Error in authcontroller.js signup : "+error.message);
        res.status(500).send("error in authcontroller.js Signup : "+error.message);
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const existingEmail = await User.findOne({email: email})

        if(!existingEmail){
            return res.status(400).json({msg: 'Email not found'})
        }

        const isMatch = await bcrypt.compare(password, existingEmail.password)

        if (!isMatch) {
            return res.status(404).json({msg: 'Password mismatch or incorrect.'})
        }

        const token = jwt.sign({userId : User._id }, process.env.JWT_TOKEN, {expiresIn: "3d"})

        await res.cookie("jwt_LinkedIn_token", token, {
            httpOnly: true,
            maxAge : 3 * 24 * 60 * 60 * 1000,
            sameSite: true,
            secure: process.env.NODE_ENV === "production",
        })

        res.status(201).json({message : 'user is Login successfully..'})


    } catch (error) {
        console.error("Error in authcontroller.js Login : "+error.message);
        res.status(500).send("error in authcontroller.js Login : "+error.message);
    }
}

export const logout = (req, res) => {
    res.clearCookie("jwt_LinkedIn_token");
    res.status(200).json({message : 'user is Logout successfully..'})
}

export const getCurrentuser = async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.error("Error in authcontroller.js getUser : "+error.message);
        res.status(500).send("error in authcontroller.js getUser : "+error.message);
    }
}