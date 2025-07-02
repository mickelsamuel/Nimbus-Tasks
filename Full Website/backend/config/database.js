const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let mongoUri;
    
    // Use in-memory database only if explicitly requested
    if (process.env.USE_MEMORY_DB === 'true') {
      console.log('Starting in-memory MongoDB for development...');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('In-memory MongoDB started successfully');
    } else {
      mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bnc-training';
    }
    
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      if (mongod) {
        await mongod.stop();
        console.log('In-memory MongoDB stopped');
      }
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;