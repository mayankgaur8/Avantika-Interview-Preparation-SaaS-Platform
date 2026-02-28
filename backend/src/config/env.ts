import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || './data/avantika.db',
  JWT_SECRET: required('JWT_SECRET'),
  RAZORPAY_KEY_ID: required('RAZORPAY_KEY_ID'),
  RAZORPAY_KEY_SECRET: required('RAZORPAY_KEY_SECRET'),
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  APP_NAME: process.env.APP_NAME || 'avantika',
};
