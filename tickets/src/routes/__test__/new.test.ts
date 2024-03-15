import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats_wrapper';


it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be access if user is sign in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).toEqual(401);
});

it('return a status other than 401 if the user is signed in', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('return an error if an incalid title is provided', async () => {
  const cookie = global.signin();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10
    }).expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      price: 10
    }).expect(400);
});
it('return an reror if an invalid price is provided', async () => {
  const cookie = global.signin();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: -10
    }).expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title'
    }).expect(400);
});
it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'title';
  const price = 20;

  const cookie = global.signin();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price
    }).expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
  const title = 'title';
  const price = 20;

  const cookie = global.signin();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price
    }).expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});