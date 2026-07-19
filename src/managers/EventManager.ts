import { type Awaitable, Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import {
	type GuildConfigurationType,
	type GuildsConfiguration,
	type InteractionCustomId,
	type StructureCustomId
} from "@typescript/index.js";
import { logger, requiredFiles } from "@utils/index.js";
import { type EventStructure, type EventStructureWithGuildConfiguration } from "structures/index.js";

type UnsafeEventExecute = (client: StelliaClient, ...args: unknown[]) => Awaitable<unknown>;

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
		const event = eventStructure as EventStructureWithGuildConfiguration<any>;

		if (once) {
			this.client.once(name, (...args) => this.eventHandler(event, ...args));
		} else {
			this.client.on(name, (...args) => this.eventHandler(event, ...args));
		}
	}

	private readonly eventHandler = async (event: EventStructureWithGuildConfiguration<any>, ...args: unknown[]): Promise<void> => {
		try {
			const execute = event.execute as UnsafeEventExecute;
			const mainArgument = args[0];
			const guildConfiguration = this.getGuildConfiguration(mainArgument);

			if (guildConfiguration) {
				await execute(this.client, guildConfiguration, ...args);
				return;
			}

			await execute(this.client, this.guildsConfiguration, ...args);
		} catch (error: unknown) {
			logger.errorWithInformation(`Error while executing event "${String(event.data.name)}"`, error);
		}
	};

	private async loadEventWithoutGuildConfiguration(eventStructure: EventStructure): Promise<void> {
		const { name, once } = eventStructure.data;
		const execute = eventStructure.execute as UnsafeEventExecute;

		const handler = async (...args: unknown[]): Promise<void> => {
			try {
				await execute(this.client, ...args);
			} catch (error: unknown) {
				logger.errorWithInformation(`Error while executing event "${String(name)}"`, error);
			}
		};

		if (once) {
			this.client.once(name, handler);
		} else {
			this.client.on(name, handler);
		}
	}

	private getGuildConfiguration(mainArgument: unknown): GuildConfigurationType | undefined {
		const guildId = this.extractGuildId(mainArgument);
		return guildId ? this.client.getGuildConfiguration(guildId) : undefined;
	}

	private extractGuildId(mainArgument: unknown): string | undefined {
		if (!mainArgument || typeof mainArgument !== "object") {
			return undefined;
		}

		if ("guildId" in mainArgument && typeof mainArgument.guildId === "string") {
			return mainArgument.guildId;
		}

		if ("guild" in mainArgument && this.isObjectWithStringId(mainArgument.guild)) {
			return mainArgument.guild.id;
		}

		if ("message" in mainArgument && typeof mainArgument.message === "object" && mainArgument.message !== null) {
			const message = mainArgument.message as Record<string, unknown>;
			if ("guild" in message && this.isObjectWithStringId(message.guild)) {
				return message.guild.id;
			}
		}

		return undefined;
	}

	private isObjectWithStringId(value: unknown): value is { id: string } {
		return typeof value === "object" && value !== null && "id" in value && typeof (value as Record<string, unknown>).id === "string";
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
