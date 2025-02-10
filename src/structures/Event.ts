import { type Awaitable, type ClientEvents } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import type { EnvironmentConfiguration } from "@typescript/types.js";

export interface EventStructure<Event extends keyof ClientEvents = keyof ClientEvents> {
    data: {
        name: Event;
        once: boolean;
    };
    execute(client: ClientEvents["ready"]): Awaitable<unknown>;
    execute(...args: ClientEvents[Event]): Awaitable<unknown>;
    execute(client: StelliaClient, ...args: ClientEvents[Event]): Awaitable<unknown>;
    execute<CustomEnvironment extends EnvironmentConfiguration>(client: ClientEvents["ready"], environment: CustomEnvironment): Awaitable<unknown>;
    execute<CustomEnvironment extends EnvironmentConfiguration>(client: StelliaClient, environment: CustomEnvironment, ...args: ClientEvents[Event]): Awaitable<unknown>;
}