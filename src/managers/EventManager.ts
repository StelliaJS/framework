import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import {
	type ClientEventsArgs,
	type EventStructure,
	type EventStructureWithAllGuildsConfiguration,
	type EventStructureWithConfiguration,
	type EventStructureWithGuildConfiguration,
	type EventStructureWithoutGuildConfiguration
} from "@structures/index.js";
import {
	type GuildConfigurationType,
	type GuildsConfiguration,
	type InteractionCustomId,
	type StructureCustomId
} from "@typescript/index.js";
import { logger, requiredFiles } from "@utils/index.js";

export class EventManager extends BaseManager<EventStructure> {
	private events: Collection<StructureCustomId, EventStructure> = new Collection();
	private guildsConfiguration: GuildsConfiguration;

	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath);
	}

	public static async create(client: StelliaClient, directoryPath: string): Promise<EventManager> {
		const manager = new EventManager(client, directoryPath);
		await manager.loadData();
		await manager.initializeGuildsConfiguration();

		return manager;
	}

	public async loadData(): Promise<void> {
		this.events = await requiredFiles<EventStructure>(this.directoryPath);

		for (const eventStructure of this.events.values()) {
			if (this.client.environment?.areGuildsConfigurationEnabled) {
				await this.loadEventWithGuildConfiguration(eventStructure);
			} else {
				await this.loadEventWithoutGuildConfiguration(eventStructure);
			}
		}

		this.setManagerLoaded();
		logger.info(`Loaded ${this.events.size} events`);
	}

	public getByCustomId(id: InteractionCustomId): EventStructure | null {
		return this.events.get(id) ?? null;
	}

	public getByRegex(id: InteractionCustomId): EventStructure | null {
		let event: EventStructure | null = null;
		for (const [customId, action] of this.events.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				event = action;
				break;
			}
		}

		return event;
	}

	public getAll(): Collection<StructureCustomId, EventStructure> {
		return this.events;
	}

	private async loadEventWithGuildConfiguration(eventStructure: EventStructure) {
		const { name, once } = eventStructure.data;
		const event = eventStructure as EventStructureWithGuildConfiguration;

		if (once) {
			this.client.once(name, (...args) => this.eventHandler(event, ...args));
		} else {
			this.client.on(name, (...args) => this.eventHandler(event, ...args));
		}
	}

	private readonly eventHandler = (event: EventStructureWithConfiguration, ...args: ClientEventsArgs) => {
		const mainArgument = args[0];
		const guildConfiguration = this.getGuildConfiguration(mainArgument);
		if (guildConfiguration) {
			const eventStructure = event as EventStructureWithGuildConfiguration;
			return eventStructure.execute(this.client, guildConfiguration, ...args);
		}

		const eventStructure = event as EventStructureWithAllGuildsConfiguration;
		return eventStructure.execute(this.client, this.guildsConfiguration, ...args);
	};

	private async loadEventWithoutGuildConfiguration(eventStructure: EventStructure): Promise<void> {
		const { name, once } = eventStructure.data;
		const event = eventStructure as EventStructureWithoutGuildConfiguration;

		if (once) {
			this.client.once(name, (...args) => event.execute(this.client, ...args));
		} else {
			this.client.on(name, (...args) => event.execute(this.client, ...args));
		}
	}

	private getGuildConfiguration(mainArgument: ClientEventsArgs[0]): GuildConfigurationType | undefined {
		if (mainArgument && typeof mainArgument === "object") {
			if ("guildId" in mainArgument && mainArgument.guildId) {
				return this.client.getGuildConfiguration(mainArgument.guildId);
			}
			if ("guild" in mainArgument && mainArgument.guild) {
				return this.client.getGuildConfiguration(mainArgument.guild.id);
			}
			if (
				"message" in mainArgument &&
				mainArgument.message &&
				typeof mainArgument.message === "object" &&
				"guild" in mainArgument.message &&
				mainArgument.message.guild &&
				"id" in mainArgument.message.guild
			) {
				return this.client.getGuildConfiguration(mainArgument.message.guild.id);
			}
		}

		return undefined;
	}

	private async initializeGuildsConfiguration(): Promise<void> {
		if (this.client.environment?.areGuildsConfigurationEnabled) {
			try {
				this.guildsConfiguration = await this.client.getGuildsConfiguration();
				logger.success("Guilds configuration loaded successfully for events");
			} catch (error: unknown) {
				logger.errorWithInformation("Error while loading guilds configuration", error);
			}
		}
	}
}
