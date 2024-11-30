//can be used also........ 
// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("application not able to talk to database", error)
            throw error
        })
        const PORT = process.env.PORT || 4000;
        // app.listen(PORT, () => {
        //     console.log(`Server is running on port: ${PORT}`);
        // });
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on http://0.0.0.0:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed !!!!!", error);
    })















//1st approch is below
/* import express from "express"
const app = express()
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("application not able to talk to database",error)
            throw error
        })
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR : ", error);
        throw error
    }
})() */