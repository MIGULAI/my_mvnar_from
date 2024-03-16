import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validationRequest } from '@migulai_org/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { natsWrapper } from '../nats_wrapper';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order_created_publisher';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => {
      return mongoose.Types.ObjectId.isValid(input);
    })
    .withMessage('TicketId is required')
], validationRequest,async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved');
  }

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });

  await order.save();

  // Publish an event saying that an order was created
  await new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  });

  return res.status(201).send(order);
});

export { router as newOrderRouter };