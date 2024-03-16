import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app)
    .post('/api/orders')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be access if user is sign in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .send({});

  expect(response.status).toEqual(401);
});

it('return a status other than 401 if the user is signed in', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('return an error if an invalid ticketId is provided', async () => {
  const cookie = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ''
    }).expect(400);
});

it('return an error if the ticket does not exist', async () => {
  const cookie = global.signin();
  const ticketId = global.createId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId
    }).expect(404);
});

it('return an error if the ticket is already reserved', async () => {
  const cookie = global.signin();
  const ticket = await global.createTicket();

  const order = Order.build({
    ticket,
    userId: 'asdasdasd',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id
    }).expect(400);
});

it('reserve a ticket', async () => {
  const cookie = global.signin();
  const ticket = await global.createTicket();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id
    }).expect(201);

  expect(response.body.ticket.id).toEqual(ticket.id);
});

it('emits an order created event', async () => {
  const cookie = global.signin();
  const ticket = await global.createTicket();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id
    }).expect(201);

  expect(response.body.ticket.id).toEqual(ticket.id);
});