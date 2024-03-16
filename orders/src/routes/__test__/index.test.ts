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


it('fetches orders for a particular user', async () => {

  const ticket1 = await global.createTicket();
  const ticket2 = await global.createTicket();
  const ticket3 = await global.createTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const response1 = await request(app)
    .get('/api/orders')
    .set('Cookie', user1)
    .send({});
    
  expect(response1.body.length).toEqual(1);

  const order1 = response1.body[0];
  
  expect(order1.ticket.id).toEqual(ticket1.id);

  const response2 = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .send({})
    .expect(200);


  expect(response2.body.length).toEqual(2);
  const order2 = response2.body[0];
  const order3 = response2.body[1];

  expect(order2.ticket.id).toEqual(ticket2.id);
  expect(order3.ticket.id).toEqual(ticket3.id);
});