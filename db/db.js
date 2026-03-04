import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const onlinDB = process.env.MONGO_URI;
const localDB = process.env.MONGO_LOCAL;

const connectOnlineDB = async () => {
    try {
        await mongoose.connect(onlinDB);
        console.log("Connected to online database successfully");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

const connectLocalDB = async () => {
    try {
        await mongoose.connect(localDB);
        console.log("Connected to Local database successfully");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

export { connectOnlineDB, connectLocalDB };