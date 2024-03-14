import { Publisher, Subjects, TicketCreatedEvent } from "@migulai_org/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}