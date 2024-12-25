import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

import User from "../models/user";
import FriendRequest from "../models/friendRequest";

require("dotenv").config({ path: ".env" });

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (user) {
            res.status(400).json({ message: "User already exists" });
        } else {
            const newUser = new User(req.body);
            await newUser.save();

            res.status(201).json(newUser);
        }
    } catch (err) {
        console.log(err);

        res.status(500).json({ 
            message: "Internal server error", 
            error: err 
        });
    }
}

export const getUser = async (req: Request, res: Response) => {
    const username: string = req.query.username as string;

    try {
        const user = await User.findOne({ username });

        if(user) {
            res.status(200).json({message: "Successfully fetched user", user});
        } else {
            res.status(404).json({ message: "User not found", user: null });
        }
    } catch (err) {
        console.log(err);

        res.status(500).json({ 
            message: "Internal server error", 
            error: err 
        });
    }
}

export const findUser = async (req: Request, res: Response) => {

    const username: string = req.query.username as string;

    try {
        const user = await User.findOne({ username }, { password: 0, email: 0 });

        if(user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.log(err);

        res.status(500).json({ 
            message: "Internal server error", 
            error: err 
        });
    }
}

export const getUsers = async (req: Request, res: Response) => {
    
    const current_user_id: string = (jwt.verify(req.cookies.jwt, process.env.JWT_SECRET as string) as { _id: string })._id;

    try {
        const current_user = await User.findById(current_user_id);
        const friendRequestsSent = await FriendRequest.find({ "sentBy": current_user_id, status: "pending" });
        const friendRequestsReceived = await FriendRequest.find({"sentTo": current_user_id, status: "pending"});

        if(current_user) {
            const users = {
                "addFriends": await User.find({ _id: { $ne: current_user_id, $nin: [...current_user.friends, ...friendRequestsSent.map((friendRequest: any) => friendRequest.sentTo), ...friendRequestsReceived.map((friendRequest: any) => friendRequest.sentBy)] } }, { id: 1, profile: 1, username: 1 }),
                "friendRequestsSent": await User.find({ _id: { $in: friendRequestsSent.map((friendRequest: any) => friendRequest.sentTo) } }, { id: 1, profile: 1, username: 1 }),
                "friendRequestsReceived": await User.find({ _id: { $in: friendRequestsReceived.map((friendRequest: any) => friendRequest.sentBy) } }, { id: 1, profile: 1, username: 1 })
            }
    
            res.status(200).json({
                message: "Successfully fetched users",
                data: users
            })
        } else {
            res.status(400).json({ message: "Users not found" });
        }

    } catch (err) {
        console.log(err);

        res.status(401).json({
            message: "Some error occurred",
            error: err
        })
    }
}