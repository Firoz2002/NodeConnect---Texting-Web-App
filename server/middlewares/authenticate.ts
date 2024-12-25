import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

require("dotenv").config({ path: ".env" });

export const register = async (req: Request, res: Response) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);

        fetch(`${process.env.API_URL}/api/v1/user`, {
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify({
               profile: req.body.profile,
               username: req.body.username,
               email: req.body.email,
               password: hash,
           })
        })
        .then(res => res.json())
        .then(data => {
            if(data) {
                const maxAge: number = 3 * 60 * 60;
                const token: string = Jwt.sign({
                    _id: data?._id,
                    username: data?.username
                }, process.env.JWT_SECRET as string, {
                    expiresIn: maxAge
                });

                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: maxAge * 1000,
                });

                res.status(201).json({
                    message: "User registered successfully",
                    data: {
                        id: data._id,
                        profile: data.profile,
                        username: data.username,
                    }
                });
            } else {
                res.status(400).json({
                    message: "User already exists",
                });
            }
        })
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    }
}

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        fetch(`${process.env.API_URL}/api/v1/user?username=${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data?.user) {
                bcrypt.compare(password, data.user.password, (err, result) => {
                    if(result) {
                        const maxAge: number = 3 * 60 * 60;
                        const token: string = Jwt.sign({
                            _id: data.user?._id,
                            username: data.user?.username
                        }, process.env.JWT_SECRET as string, {
                            expiresIn: maxAge
                        });

                        res.cookie("jwt", token, {
                            httpOnly: true,
                            maxAge: maxAge * 1000,
                            sameSite: "none",
                            secure: true                    
                        });

                        res.status(201).json({
                            message: "User logged in successfully",
                            data: {
                                id: data.user._id,
                                profile: data.user.profile,
                                username: data.user.username,
                            }
                        });
                    } else {
                        res.status(400).json({
                            message: "Wrong password",
                            error: err
                        });
                    }
                })
            } else {
                res.status(400).json({
                    message: "User does not exist",
                });
            }
        })
        
    } catch (err) {
        
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if(token) {
            Jwt.verify(token, process.env.JWT_SECRET as string, (err: any) => {
                if(err) {
                    res.status(401).json({
                        message: "Unauthorized",
                        error: err
                    }); 
                } else {    
                    next();
                }
            });
        } else {    
            res.status(401).json({
                message: "Unauthorized",
            }); 
        }
    } catch (err) {
        console.log(err); 
        
        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        console.log(req.params);
        res.clearCookie("jwt");

        res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    }
}