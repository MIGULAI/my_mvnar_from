import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current_user';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { errorHandler } from './middlewares/error_handler';
import { NotFoundError } from './errors/not_found_error';

const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession(
  {
    signed: false,
    secure: true
  }
));


app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    console.log(process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

  } catch (err) {
    console.error(err);
  }

  app.listen(process.env.PORT, () => {
    console.log(`Auth service is running on port ${process.env.PORT}`);
  });
};


start();
