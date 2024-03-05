import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler } from '@migulai_org/common';
import { NotFoundError } from '@migulai_org/common';

import { currentUserRouter } from './routes/current_user';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';


const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession(
  {
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
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


export { app };