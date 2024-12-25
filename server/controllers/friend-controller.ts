import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import User from "../models/user";
import FriendRequest from "../models/friendRequest";

interface User {
    _id: string;
    profile: string;
    username: string;
};

export const createFriendRequest = async (req: Request, res: Response) => {
        const current_user_id: string = (jwt.verify(req.cookies.jwt, process.env.JWT_SECRET as string) as { _id: string })._id;

    try {
        const newFriendRequest = new FriendRequest({
            sentTo: req.body.sentTo,
            sentBy: current_user_id,
        });

        await newFriendRequest.save();

        res.status(200).json({ message: "Friend Request created successfully", data: newFriendRequest });

    } catch (err) {
        console.log(err);

        res.status(400).json({
            message: "Internal server error",
            error: err
        })
    }
}

export const fetchFriendRequests = async (req: Request, res: Response) => {
    const current_user_id: string = (jwt.verify(req.cookies.jwt, process.env.JWT_SECRET as string) as { _id: string })._id;

    try {
        const friendRequestSent = await FriendRequest.find({ "sentBy": current_user_id, status: "pending" });
        const friendRequestReceived = await FriendRequest.find({"sentTo": current_user_id, status: "pending"});

        const friendRequests = {
            friendRequestSent,
            friendRequestReceived
        };

        res.status(200).json(friendRequests);
        
    } catch (err) {
        console.log(err);

        res.status(400).json({
            message: "Internal server error",
            error: err
        })
    }
}

export const updateFriendRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {

        const friendRequest = await FriendRequest.findById(id);

        if (!friendRequest) {
            res.status(404).json({ message: "Friend request not found" });
        } else {
            friendRequest.status = status;
            await friendRequest.save();

            if(status === "accepted") {
                await User.findByIdAndUpdate(friendRequest.sentTo._id, {
                    $push: { friends: friendRequest.sentBy }
                });

                await User.findByIdAndUpdate(friendRequest.sentBy._id, {
                    $push: { friends: friendRequest.sentTo }
                });
            }

            res.status(200).json({ message: "Friend request updated successfully", data: friendRequest });
        }
        
    } catch (err) {
        console.log(err);

        res.status(400).json({
            message: "Internal server error",
            error: err
        })
    }
}

export const getFriends = async (req: Request, res: Response) => {
    
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET as string) as { _id: string };
    const user_id: string = decoded._id;

    try {
        const user = await User.findById(user_id, { friends: 1 });

        if(user) {
            if(user?.friends) {
                const friends = await Promise.all(user.friends.map(async (friend: any) => User.findById(friend._id, { id: 1, profile: 1, username: 1 })));
                res.status(200).json(friends);
            } else  {
                res.status(200).json([]);
            }
            
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