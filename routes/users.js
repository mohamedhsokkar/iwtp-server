import express from "express";
const router = express.Router();
import { check, validationResult } from "express-validator";
import User from "../db/models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateAccessToken } from "./utils/index.js";

import dotenv from "dotenv";
dotenv.config();
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET


/*
get the request body.
validate the request body.
check if user exists, if yes, return error.
encrypt password.
save data in db.
using jwt create token contains user id, return token.
*/

/*
path: POST api/users/login
Desc: register a new user
public
*/

router.post("/register",
    check("name", "Name is required").notEmpty(),
    check("email", "Please incllude a valid email").isEmail(),
    check("password", "Please choose a password with at least 6 characters").isLength({ min: 6 }),
    check("nationalID", "National ID is numbers only").isNumeric(),
    check("nationalID", "National ID consists of 14 numbers").isLength({ min: 14, max: 14}),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const { name, email, password, nationalID } = req.body;
        
        try {
            let user = await User.findOne({email});
            if(user) {
                return res.status(400).json({error: [{msg: "user already exist"}]})
            }

            user = new User({
                name,
                email,
                password,
                nationalID
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,jwtAccessSecret, {expiresIn: "5 days"}, (err, token) => {
                if(err) {
                    throw err;
                } else {
                    res.json({token});
                }
            })

        } catch(err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }
)

/*
path: POST api/users/login
Desc: login an existing user
public
*/

router.post("/login",
    check("email", "Please incllude a valid email").isEmail(),
    check("password", "Please choose a password with at least 6 characters").isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const { email, password } = req.body;
        
        try {
            let user = await User.findOne({email});
            if(!user) {
                return res.status(400).json({error: [{msg: "Invalid credentials"}]})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({error: [{msg: "Invalid credentials"}]})
            }
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,jwtAccessSecret, {expiresIn: "5 days"}, (err, token) => {
                if(err) {
                    throw err;
                } else {
                    res.json({token});
                }
            })

        } catch(err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }
)

/*
path: GET api/users/
Desc: takes a token and return user information
Private
*/

router.get("/", validateAccessToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user)
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message)
    }
})

export default router;
