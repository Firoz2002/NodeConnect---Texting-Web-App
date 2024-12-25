import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { Server as socket } from "socket.io";

import routes from "./routes/index";
import connect from "./config/database";
import setupSocket from "./utils/socket";

const app: Express = express();

require("dotenv").config({ path: ".env" });
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', routes);

const server = app.listen(PORT, async() => {
    try {
        await connect();
        console.log("Server is running on port", PORT);
    } catch (error) {
        console.log(error);
    }
});

const io = new socket(server, {
    cors: {
        origin: process.env.CLIENT_URL,
    }
});

setupSocket(io as socket);