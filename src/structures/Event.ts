import { type Awaitable, type ClientEvents } from "discord.js";
import { type StelliaClient } from "@client/index.js";

export interface EventStructure {
    data: {
        name: keyof ClientEvents;
        once: boolean;
    }
    execute(client: StelliaClient, ...args: unknown[]): Awaitable<unknown>;
}