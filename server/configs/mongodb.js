import mongoose from "mongoose";
// connect to the mongodb database
const connectDB = async () => {
    // registering the event
    mongoose.connection.on('connected', () => console.log('Database Connected'));
    await mongoose.connect(`${process.env.MONGODB_URI}/EduCoreLMS`)
};
export default connectDB;