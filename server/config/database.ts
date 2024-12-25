import mongoose from "mongoose";

require("dotenv").config({ path: ".env" });

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL as string);
        console.log("Database connected");
    } catch (error) {
        throw new Error(error);
    }
};

export default connect;