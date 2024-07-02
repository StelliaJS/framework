import { type Awaitable, type ClientEvents } from "discord.js";
import { type StellaClient } from "@client/index.js";

export interface EventStructure {
    data: {
        name: keyof ClientEvents;
        once: boolean;
    }
    execute(client: StellaClient, ...args: unknown[]): Awaitable<unknown>;
}