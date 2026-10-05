import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the URI provided in environment variables.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URL;

  if (!uri || uri === 'your_mongodb_connection_string') {
    console.error(
      'MongoDB connection error: MONGODB_URL is not configured in server/.env.\n' +
      'Please set MONGODB_URI in server/.env to a valid MongoDB URL (e.g. mongodb://127.0.0.1:27017/skillforge or mongodb+srv://...)'
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
