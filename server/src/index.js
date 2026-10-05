import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // 1. Establish MongoDB connection
  await connectDB();

  // 2. Start Express server only after MongoDB connects successfully
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();