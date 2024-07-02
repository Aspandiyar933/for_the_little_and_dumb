import mongoose from "mongoose";
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017');
        await client.connect();
        console.log('MongoDB connected...');
        return client.db('u');
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
} 

export const closeDatabaseConnection = async() => {
    await client.close();
}

