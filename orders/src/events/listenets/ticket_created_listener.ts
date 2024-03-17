import { Listener, Subjects, TicketCreatedEvent } from "@migulai_org/common";
import { Ticket } from "../../models/ticket";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue_group_name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}