import request from 'supertest';
import { app } from '../../app';
import { OrderStatus } from '@migulai_org/common';
import { natsWrapper } from '../../nats_wrapper';

it('order was deleted', async () => {
  const cookie = global.signin();
  const ticket = await global.createTicket();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
  const deleteResponse = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(deleteResponse.body.id).toEqual(order.id);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  
  expect(response.body[0].status).toEqual(OrderStatus.Cancelled);
});


it('emits an order cancelled event', async () => {
  const cookie = global.signin();
  const ticket = await global.createTicket();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
  const deleteResponse = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(deleteResponse.body.id).toEqual(order.id);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});