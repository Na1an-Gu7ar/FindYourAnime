import dotenv from 'dotenv';

dotenv.config();

export const env = {
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-this-secret',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/find-your-anime',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000)
};
