import { OrderCreatedEvent, Publisher, Subjects } from "@migulai_org/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}