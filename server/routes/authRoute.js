import express from 'express';
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const loginController = async (req, res) => {
    try {
        const { name, email, image } = req.body;

        const user = await userModel.findOne({ email });
        if (user) {
        // create token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" } );

        return res.status(200).send(
            {
                success: true,
                message: 'Logged in successfully!',
                data: {
                    name: user.name,
                    email: user.email,
                    id: user?._id,
                    profile: user?.profile
                },
                token
            }
        );
        }

        const newUser = await new userModel({name, email, profile: image}).save();

        return res.status(200).send(
            {
                success: true,
                message: 'User registered successfully!',
                data: newUser
            }
        );
    } catch (err) {
        console.log('Error in loginController', { err });
        res.status(500).send(
            {
                success: false,
                message: 'Error in login',
                error: err
            }
        );
    }
};

const router = express.Router();

router.post('/login', loginController);

export default router;