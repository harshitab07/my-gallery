import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDb: Host = ${conn.connection.host}`);
    } catch (err) {
        console.log(`Error in mongoDb: ${err}`);
    }
}

export default connectDb;