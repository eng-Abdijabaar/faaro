import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("MONGODB_URI is missing. Check backend/.env");
  }

  const connection = await mongoose.connect(uri);

  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
};

export default connectDB;