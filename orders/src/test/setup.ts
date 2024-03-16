import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Ticket, TicketDoc } from '../models/ticket';

jest.mock('../nats_wrapper');

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'test';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});


beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

declare global {
  var signin: () => string[];
  var createId: () => string;
  var createTicket: () => Promise<TicketDoc>;
}

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'dev@test.dev'
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  
  const session = {jwt: token};
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];;
}

global.createId = () => {
  return new mongoose.Types.ObjectId().toHexString();
}

global.createTicket = async () => {
  const ticket = Ticket.build({
    title: 'test ticket',
    price: 20,
  });
  
  await ticket.save();
  return ticket;

}