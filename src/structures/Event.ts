import { type Awaitable, type ClientEvents } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { type EnvironmentConfiguration } from "@typescript/types.js";

export interface EventStructureWithEnvironment extends EventInteractionStructure {
    execute(client: StelliaClient, environment: EnvironmentConfiguration, ...args: ClientEvents[Event]): Awaitable<unknown>;
}
export interface EventStructureWithoutEnvironment extends EventInteractionStructure {
    execute(client: StelliaClient, ...args: ClientEvents[Event]): Awaitable<unknown>;
}
export type EventStructure = EventStructureWithEnvironment | EventStructureWithoutEnvironment;

interface EventInteractionStructure {
    data: EventDataStructure;
}
interface EventDataStructure {
    name: Event;
    once: boolean;
}
type Event = keyof ClientEvents;