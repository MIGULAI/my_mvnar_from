import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler } from '@migulai_org/common';
import { NotFoundError } from '@migulai_org/common';
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';

const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession(
  {
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  }
));
app.use(currentUser);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);


export { app };