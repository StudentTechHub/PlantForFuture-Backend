import express, { json } from "express";
import connectDB from "./db";
import creatorRouter from "./routes/creator";
import cookieParser from "cookie-parser";
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(json());
app.use(cookieParser())

app.get('/helloworld', (req, res) => {
    res.send('Hello World');
})

app.use("/api/v1/creator", creatorRouter);
app.use("/api/v1/volunteer")

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});