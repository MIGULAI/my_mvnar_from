import 'express-async-errors';
import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats_wrapper';
import { TicketCreatedListener } from './events/listenets/ticket_created_listener';
import { TicketUpdatedListener } from './events/listenets/ticket_updated_listener';
import { Ticket } from './models/ticket';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  try {

    console.log(process.env.MONGO_URI);
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );


    natsWrapper.client.on("close", (data) => {
      console.log("NATS connection closed!");
      process.exit();
    });

    // process.on('uncaughtException', (err) => {
    //   console.log('Uncaught Exception');
    //   console.error(err);
    //   // natsWrapper.client.close();
    // });

    process.on("SIGINT", () => {
      console.log("SIGINT received");
      natsWrapper.client.close()
    });
    process.on("SIGTERM", () => {
      console.log("SIGTERM received");
      natsWrapper.client.close()
    });

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI as string,);
    console.log('Connected to MongoDB');


  } catch (err) {
    console.error(err);
  }

  app.listen(process.env.PORT, () => {
    console.log(`Ticket service is running on port ${process.env.PORT}`);
  });
};


start();
