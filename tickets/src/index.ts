import 'express-async-errors';
import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    console.log(process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI as string, );
    console.log('Connected to MongoDB');

  } catch (err) {
    console.error(err);
  }

  app.listen(process.env.PORT, () => {
    console.log(`Ticket service is running on port ${process.env.PORT}`);
  });
};


start();
