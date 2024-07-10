import express, { json } from "express";
import connectDB from "./db.js";
import creatorRouter from "./routes/creator.route.js";
import volunteerRouter from "./routes/volunteer.route.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors'; // Add this line
dotenv.config();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();

const PORT = process.env.PORT || 3001;

app.use(json());
app.use(cookieParser());
app.use(cors(corsOptions)); // Add this line

app.get('/helloworld', (req, res) => {
    res.send('Hello World');
})

app.use("/api/v1/creator", creatorRouter);
app.use("/api/v1/volunteer", volunteerRouter)

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});