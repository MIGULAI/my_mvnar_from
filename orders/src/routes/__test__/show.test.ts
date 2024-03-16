import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/orders for get requests', async () => {
  const response = await request(app)
    .get('/api/orders')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be access if user is sign in', async () => {
  const response = await request(app)
    .get('/api/orders')
    .send({});

  expect(response.status).toEqual(401);
});

it('return a status other than 401 if the user is signed in', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it('fetch order with not mongo id', async () => {
  const cookie = global.signin();

  await request(app)
    .get('/api/orders/1234')
    .set('Cookie', cookie)
    .send({})
    .expect(400);
});

it('fetch order with not found order id', async () => {
  const cookie = global.signin();

  await request(app)
    .get(`/api/orders/${global.createId()}`)
    .set('Cookie', cookie)
    .send({})
    .expect(404);
});


it('fetches orders from other user', async () => {
  const ticket1 = await global.createTicket();

  const user1 = global.signin();
  const user2 = global.signin();
  
  const orderResponse = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);


  await request(app)
    .get(`/api/orders/${orderResponse.body.id}`)
    .set('Cookie', user2)
    .send({})
    .expect(401);
})

it('fetches orders for a particular user', async () => {
  const ticket1 = await global.createTicket();

  const user1 = global.signin();
  
  const orderResponse = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${orderResponse.body.id}`)
    .set('Cookie', user1)
    .send({})
    .expect(200);
});