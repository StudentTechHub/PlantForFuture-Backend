import express, { json } from "express";
import connectDB from "./db.js";
import creatorRouter from "./routes/creator.route.js";
import volunteerRouter from "./routes/volunteer.route.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors'; // Add this line
import activityRouter from "./routes/activity.route.js";
dotenv.config();

const corsOptions = {
    origin: ["https://plantforfuture.netlify.app", "http://localhost"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
};

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors({
    ...corsOptions,
}));

app.use(json());
app.use(cookieParser());

app.use((req, res, next) => {
    // Log incoming requests
    console.log(`${req.method} ${req.originalUrl}`);
    next();
})

// app.options('*', cors(corsOptions))

app.get('/helloworld', (req, res) => {
    res.send('Hello World');
})

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use("/api/v1/creator", creatorRouter);
app.use("/api/v1/volunteer", volunteerRouter)
app.use("/api/v1/activity", activityRouter)

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});