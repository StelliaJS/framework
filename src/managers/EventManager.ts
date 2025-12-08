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
import { requiredFiles } from "@utils/index.js";
import { logger } from "@utils/logger.js";

export class EventManager extends BaseManager {
	private interactions: Collection<StructureCustomId, EventStructure> = new Collection();
	private guildsConfiguration: GuildsConfiguration;

    private constructor(client: StelliaClient, directoryPath: string) {
        super(client, directoryPath);
    }

    public static async create(client: StelliaClient, directoryPath: string): Promise<EventManager> {
        const manager = new EventManager(client, directoryPath);
        await manager.loadData();
        await manager.initializeGuildsConfiguration();

        return manager;
    };

	public async loadData(): Promise<void> {
		const events = await requiredFiles<EventStructure>(this.directoryPath);
		this.interactions = events;

		for (const eventStructure of this.interactions.values()) {
			if (this.client.environment?.areGuildsConfigurationEnabled) {
				await this.loadEventWithGuildConfiguration(eventStructure);
			} else {
				await this.loadEventWithoutGuildConfiguration(eventStructure);
			}
		}

		this.setManagerLoaded();
	}

	public getByCustomId<EventStructure>(id: InteractionCustomId): EventStructure | null {
		const event = (this.interactions.get(id) as EventStructure) ?? null;
		return event;
	}

	public getByRegex<EventStructure>(id: InteractionCustomId): EventStructure | null {
        let event = null;
        for (const [customId, action] of this.interactions.entries()) {
            if (customId instanceof RegExp && customId.test(id)) {
                event = action as EventStructure;
                break;
            }
        }

        return event;
	}

	public getAll<EventStructure>(): Collection<StructureCustomId, EventStructure> {
		const events = this.interactions as Collection<StructureCustomId, EventStructure>;
		return events;
	}

	private async loadEventWithGuildConfiguration(eventStructure: EventStructure) {
		const { name, once } = eventStructure.data;
		const event = eventStructure as EventStructureWithGuildConfiguration;

		if (once) {
			this.client.once(name, (...args) => this.eventHandler(event, ...args));
		} else {
			this.client.on(name, (...args) => this.eventHandler(event, ...args));
		}
	};

	private readonly eventHandler = (event: EventStructureWithConfiguration, ...args: ClientEventsArgs) => {
		const mainArgument = args[0];
		const guildConfiguration = this.getGuildConfiguration(mainArgument);
		if (guildConfiguration) {
			const eventStructure = event as EventStructureWithGuildConfiguration;
			return eventStructure.execute(this.client, guildConfiguration, ...args);
		}

		const eventStructure = event as EventStructureWithAllGuildsConfiguration;
		return eventStructure.execute(this.client, this.guildsConfiguration);
	};

	private async loadEventWithoutGuildConfiguration(eventStructure: EventStructure): Promise<void> {
		const { name, once } = eventStructure.data;
		const event = eventStructure as EventStructureWithoutGuildConfiguration;

		if (once) {
			this.client.once(name, (...args) => event.execute(this.client, ...args));
		} else {
			this.client.on(name, (...args) => event.execute(this.client, ...args));
		}
	};

	private getGuildConfiguration(mainArgument: ClientEventsArgs[0]): GuildConfigurationType | undefined {
		if (mainArgument && typeof mainArgument === "object") {
			if ("guildId" in mainArgument && mainArgument.guildId) {
				return this.client.getGuildConfiguration(mainArgument.guildId);
			}
			if ("guild" in mainArgument && mainArgument.guild) {
				return this.client.getGuildConfiguration(mainArgument.guild.id);
			}
            if (mainArgument && typeof mainArgument === "object" &&
                "message" in mainArgument && mainArgument.message &&
                typeof mainArgument.message === "object" && "guild" in mainArgument.message &&
                mainArgument.message.guild && "id" in mainArgument.message.guild
            ) {
                return this.client.getGuildConfiguration(mainArgument.message.guild.id);
            }
		}

		return undefined;
	};

    private async initializeGuildsConfiguration(): Promise<void> {
        if (this.client.environment?.areGuildsConfigurationEnabled) {
            try {
                const guildsConfiguration = await this.client.getGuildsConfiguration();
                this.guildsConfiguration = guildsConfiguration;
                logger.success("Guilds configuration loaded successfully for events");
            } catch (error: any) {
                logger.errorWithInformation("Error while loading guilds configuration", error);
            }
        }
    };
}
