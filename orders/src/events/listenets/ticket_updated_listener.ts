import { Listener, Subjects, TicketUpdatedEvent } from "@migulai_org/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue_group_name";


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = await Ticket.findOne({
      _id: id,
      version: data.version - 1,
    });
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.set({
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}