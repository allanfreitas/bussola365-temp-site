import { Message, messages } from "../schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export class MessageRepo {
    async getMessage(messageId: string): Promise<Message> {
        const message = await db.select().from(messages).where(eq(messages.id, messageId));
        if (message.length > 0) {
            return message[0];
        }

        throw new Error("Message not found");
    }
}

const messageRepo = new MessageRepo();
export default messageRepo;
