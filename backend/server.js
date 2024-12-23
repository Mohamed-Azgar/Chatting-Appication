import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import userRoutes from "./routes/user.routes.js";

import {app, server} from  "./socket/socket.js";

import connectToMongoDB from "./db/connectToMongoDB.js";

//  const app =express();

const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); // to parse the incomeing reqest with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


// app.get("/", (req,res) => {// root route http://localhost:5000/
//     res.send("Hello azddhlsd!!1");
// });



 server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`server running on port ${PORT}`);
 });
