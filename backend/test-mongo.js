const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    console.log('Connection State:', mongoose.connection.readyState);
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection failed!');
    console.error('Error:', err.message);
    process.exit(1);
  }
};

testConnection();
