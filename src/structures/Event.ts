import { type Awaitable, type ClientEvents } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { type GuildConfigurationType, type GuildsConfiguration } from "@typescript/index.js";

export type EventKeys = keyof ClientEvents;

export type EventExecute<K extends EventKeys, ExtraArgs extends unknown[] = []> = (client: StelliaClient, ...args: [...ExtraArgs, ...ClientEvents[K]]) => Awaitable<unknown>;

export interface EventDataStructure<K extends EventKeys> {
	name: K;
	once?: boolean;
}

export interface EventStructureWithoutGuildConfiguration<K extends EventKeys> {
	data: EventDataStructure<K>;
	execute: EventExecute<K>;
}

export interface EventStructureWithGuildConfiguration<K extends EventKeys, TConfig extends GuildConfigurationType = GuildConfigurationType> {
	data: EventDataStructure<K>;
	execute: EventExecute<K, [TConfig]>;
}

export interface EventStructureWithAllGuildsConfiguration<K extends EventKeys, TGuildsConfig extends GuildsConfiguration = GuildsConfiguration> {
	data: EventDataStructure<K>;
	execute: EventExecute<K, [TGuildsConfig]>;
}

export function defineEvent<K extends EventKeys>(event: EventStructureWithoutGuildConfiguration<K>) {
	return event;
}

export function createGuildEventFactory<TConfig extends GuildConfigurationType = GuildConfigurationType>() {
	return function <K extends EventKeys>(event: EventStructureWithGuildConfiguration<K, TConfig>) {
		return event;
	};
}

export function createAllGuildsEventFactory<TGuildsConfig extends GuildsConfiguration = GuildsConfiguration>() {
	return function <K extends EventKeys>(event: EventStructureWithAllGuildsConfiguration<K, TGuildsConfig>) {
		return event;
	};
}

export type EventStructure =
	| EventStructureWithGuildConfiguration<any, any>
	| EventStructureWithAllGuildsConfiguration<any, any>
	| EventStructureWithoutGuildConfiguration<any>;