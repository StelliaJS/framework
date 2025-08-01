import { type Awaitable, type ClientEvents } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { type GuildConfigurationType, type GuildsConfiguration } from "@typescript/types.js";

export interface EventStructureWithGuildConfiguration extends EventInteractionStructure {
	execute(client: StelliaClient, guildConfiguration: GuildConfigurationType, ...args: ClientEventsArgs): Awaitable<unknown>;
}
export interface EventStructureWithAllGuildsConfiguration extends EventInteractionStructure {
	execute(client: StelliaClient, guildsConfiguration: GuildsConfiguration, ...args: ClientEventsArgs): Awaitable<unknown>;
}
export interface EventStructureWithoutGuildConfiguration extends EventInteractionStructure {
	execute(client: StelliaClient, ...args: ClientEventsArgs): Awaitable<unknown>;
}
export type EventStructureWithConfiguration = EventStructureWithGuildConfiguration | EventStructureWithAllGuildsConfiguration;
export type EventStructure = EventStructureWithGuildConfiguration | EventStructureWithAllGuildsConfiguration | EventStructureWithoutGuildConfiguration;

interface EventInteractionStructure {
	data: EventDataStructure;
}
interface EventDataStructure {
	name: EventKeys;
	once: boolean;
}
export type ClientEventsArgs = ClientEvents[keyof ClientEvents];
export type EventKeys = keyof ClientEvents;