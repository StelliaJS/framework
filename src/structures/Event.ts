import { type Awaitable, Events } from "discord.js";
import type { StellaClient } from "@client/index.js";

export interface EventStructure {
    data: {
        name: Events;
        once: boolean;
    }
    execute(client: StellaClient, ...args: unknown[]): Awaitable<unknown>;
}