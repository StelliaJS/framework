import { type Awaitable, type ClientEvents } from "discord.js";
import { type StelliaClient } from "@client/index.js";

type EventArguments<Event extends keyof ClientEvents> = ClientEvents[Event];

export interface EventStructure<Event extends keyof ClientEvents = keyof ClientEvents> {
    data: {
        name: keyof ClientEvents;
        once: boolean;
    }
    execute(client: StelliaClient, ...args: EventArguments<Event>): Awaitable<unknown>;
}