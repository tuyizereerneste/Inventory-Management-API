import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Establishes a connection to the MongoDB database 
 * by using the connection string from the environment variables.
 *
 * @function connectDB
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If the connection attempt fails.
 */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;