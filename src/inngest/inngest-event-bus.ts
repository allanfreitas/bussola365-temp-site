import { DomainEvent, EventBus } from "@/types/event-bus";
import { inngest } from "./client";


export class InngestEventBus implements EventBus {
    async publish(events: DomainEvent[]) {
        for (const event of events) {
            await inngest.send(event);
        }
    }
}