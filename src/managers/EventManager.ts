import { Collection, Events } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import {
    type ClientEventsArgs,
    type EventStructure, EventStructureWithAllGuildsConfiguration, EventStructureWithConfiguration,
    type EventStructureWithGuildConfiguration,
    type EventStructureWithoutGuildConfiguration
} from "@structures/index.js";
import {
    type StructureCustomId,
    type InteractionCustomId,
    type GuildsConfiguration,
    type GuildConfigurationType
} from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";
import { logger } from "@utils/logger.js";

export class EventManager extends BaseManager {
    private interactions: Collection<StructureCustomId, EventStructure> = new Collection();
    private guildsConfiguration: GuildsConfiguration;

    constructor(client: StelliaClient, directoryPath: string) {
        super(client, directoryPath);

        if (this.client.environment.areGuildsConfigurationEnabled) {
            this.client.getGuildsConfiguration()
                .then((guildsConfiguration) => {
                    this.guildsConfiguration = guildsConfiguration;
                    logger.success("Guilds configuration loaded successfully for event manager");
                })
                .catch((error) => logger.error(`Error while loading guilds configuration: ${error}`));
        }
    }

    public async loadData(): Promise<void> {
        const events = await requiredFiles<EventStructure>(this.directoryPath);
        this.interactions = events;

        for (const eventStructure of this.interactions.values()) {
            if (this.client.environment.areGuildsConfigurationEnabled) {
                await this.loadEventWithGuildConfiguration(eventStructure);
            } else {
                await this.loadEventWithoutGuildConfiguration(eventStructure);
            }
        }

        this.client.on(Events.Error, (error) => logger.error(`Client error: ${error}`));
        this.setManagerLoaded();
    }

    public getByCustomId<EventStructure>(id: InteractionCustomId): EventStructure | undefined {
        const event = this.interactions.get(id) as EventStructure ?? undefined;
        return event;
    }

    public getByRegex<EventStructure>(id: InteractionCustomId): EventStructure | undefined {
        return undefined;
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
    }

    private eventHandler = (event: EventStructureWithConfiguration, ...args: ClientEventsArgs) => {
        const mainArgument = args[0];
        if (!mainArgument) {
            const eventStructure = event as EventStructureWithAllGuildsConfiguration;
            return eventStructure.execute(this.client, this.guildsConfiguration);
        }

        const guildConfiguration = this.getGuildConfiguration(mainArgument);
        if (guildConfiguration) {
            const eventStructure = event as EventStructureWithGuildConfiguration;
            return eventStructure.execute(this.client, guildConfiguration, ...args);
        }

        logger.warn(`No guild configuration found for event ${event.data.name} with main argument ${mainArgument}`);
    };

    private async loadEventWithoutGuildConfiguration(eventStructure: EventStructure) {
        const { name, once } = eventStructure.data;
        const event = eventStructure as EventStructureWithoutGuildConfiguration;

        if (once) {
            this.client.once(name, (...args) => event.execute(this.client, ...args));
        } else {
            this.client.on(name, (...args) => event.execute(this.client, ...args));
        }
    }

    private getGuildConfiguration(mainArgument: ClientEventsArgs[0]): GuildConfigurationType {
        if (mainArgument && typeof mainArgument === "object") {
            if ("guildId" in mainArgument && mainArgument.guildId) {
                return this.client.getGuildConfiguration(mainArgument.guildId);
            }
            if ("guild" in mainArgument && mainArgument.guild) {
                return this.client.getGuildConfiguration(mainArgument.guild.id);
            }
        }

        return undefined;
    }
}