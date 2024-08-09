import { type Awaitable, type ClientEvents } from "discord.js";
import { type StelliaClient } from "@client/index.js";

export interface EventStructure<Event extends keyof ClientEvents = keyof ClientEvents> {
    data: {
        name: Event;
        once: boolean;
    };
    execute(client: StelliaClient, ...args: ClientEvents[Event]): Awaitable<unknown>;
}