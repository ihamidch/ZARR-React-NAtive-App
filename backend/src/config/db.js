const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn(
      '[db] MONGO_URI not set — running without database. Auth routes will return 503.',
    );
    return;
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[db] Connection error: ${error.message}`);
    console.warn(
      '[db] Continuing without database. Auth routes will return 503 until Mongo is reachable.',
    );
  }
};

module.exports = connectDB;
