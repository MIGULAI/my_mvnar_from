import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler } from '@migulai_org/common';
import { NotFoundError } from '@migulai_org/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';


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
app.use(updateTicketRouter);
app.use(indexTicketRouter);
app.use(showTicketRouter);
app.use(createTicketRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);


export { app };