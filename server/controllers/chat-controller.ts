import jwt from 'jsonwebtoken'
import { Request, Response } from "express";

import Message from "../models/message";

export const getChats = async (req: Request, res: Response) => {
    const user1: string = req.params.id as string;
    const user2: string = (jwt.verify(req.cookies.jwt, process.env.JWT_SECRET as string) as { username: string }).username;

    try {
        const messages = await Message.find({
            $or: [
                { $and: [{ "sendBy": user1}, {"sendTo": user2}] },
                { $and: [{ "sendBy": user2}, {"sendTo": user1}] }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);

    } catch (err) {
        console.log(err);

        res.status(500).json({ 
            message: "Internal server error",
            error: err 
        });
    }
}

export const saveChat = async (req: Request, res: Response) => {
    const { receiver_id, message } = req.body;
    const sender_id: string = (jwt.verify(req.cookies.jwt, process.env.JWT_SECRET as string) as { username: string }).username;

    try {
        const newMessage = new Message({
            sendBy: sender_id,
            sendTo: receiver_id,
            message: message
        });
        await newMessage.save();

        res.status(200).json({ message: "Message saved successfully" });

    } catch (err) { 
        console.log(err);

        res.status(500).json({ 
            message: "Internal server error",
            error: err 
        });
    }
}

export const deleteChats = async (req: Request, res: Response) => {
    try {
        const user1: string = req.params.id as string;
        const user2: string = (jwt.verify(req.cookies.jwt, process.env.JWT_SECRET as string) as { username: string }).username;

        await Message.deleteMany({
            $or: [
                { $and: [{ "sendBy": user1}, {"sendTo": user2}] },
                { $and: [{ "sendBy": user2}, {"sendTo": user1}] }
            ]
        });

        res.status(200).json({ message: "Chat deleted successfully" });
        
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}