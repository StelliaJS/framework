import { Collection, Events } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type EventStructure } from "@structures/index.js";
import { type StructureCustomId, type InteractionCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class EventManager extends BaseManager {
    private interactions: Collection<StructureCustomId, EventStructure> = new Collection();

    constructor(client: StelliaClient, directoryPath: string) {
        super(client, directoryPath);
    }

    public async loadData(): Promise<void> {
        const events = await requiredFiles<EventStructure>(this.directoryPath);
        this.interactions = events;

        for (const event of this.interactions.values()) {
            const { name, once } = event.data;
            if (this.client.environment.areEnvironmentsEnabled) {
                const environment = await this.client.getEnvironment();
                if (name == Events.ClientReady) {
                    this.client.once(name, () => event.execute(this.client, environment));
                    continue;
                }

                if (once) {
                    this.client.once(name, (...args) => event.execute(this.client, environment, ...args));
                } else {
                    this.client.on(name, (...args) => event.execute(this.client, environment, ...args));
                }
            } else {
                if (name == Events.ClientReady) {
                    this.client.once(name, () => event.execute(this.client));
                    continue;
                }

                if (once) {
                    this.client.once(name, (...args) => event.execute(this.client, ...args));
                } else {
                    this.client.on(name, (...args) => event.execute(this.client, ...args));
                }
            }
        }

        this.client.on(Events.Error, (error) => console.error(error));
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
}