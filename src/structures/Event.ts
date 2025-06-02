import { type Awaitable, type ClientEvents } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { type GuildsConfiguration } from "@typescript/types.js";

export interface EventStructureWithGuildsConfiguration extends EventInteractionStructure {
    execute(client: StelliaClient, guildsConfiguration: GuildsConfiguration, ...args: ClientEvents[Event]): Awaitable<unknown>;
}
export interface EventStructureWithoutGuildsConfiguration extends EventInteractionStructure {
    execute(client: StelliaClient, ...args: ClientEvents[Event]): Awaitable<unknown>;
}
export type EventStructure = EventStructureWithGuildsConfiguration | EventStructureWithoutGuildsConfiguration;

interface EventInteractionStructure {
    data: EventDataStructure;
}
interface EventDataStructure {
    name: Event;
    once: boolean;
}
type Event = keyof ClientEvents;