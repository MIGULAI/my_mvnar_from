import supertest from "supertest";
import { Ticket } from "../ticket";


it('version number is incremented on multiple saves', async () => {
    const ticket = await Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    }).save();

    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});

it('implements optimistic concurrency control', async () => {
    const ticket = await Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    }).save();


    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10 });

    secondInstance!.set({ price: 15 });
    
    await firstInstance!.save();
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach this point');
});