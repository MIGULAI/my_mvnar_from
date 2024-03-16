import { OrderCancelledEvent, Publisher, Subjects } from "@migulai_org/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}