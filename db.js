import { connect } from 'mongoose';
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URL);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

export default connectDB;