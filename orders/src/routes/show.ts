import { BadRequestError, NotAuthorizedError, NotFoundError, RequestValidationError, requireAuth } from '@migulai_org/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import mongoose, { mongo } from 'mongoose';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  if (mongoose.Types.ObjectId.isValid(orderId) === false){
    throw new BadRequestError('Invalid orderId');
  }
  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  return res.send(order);
});

export { router as showOrderRouter };