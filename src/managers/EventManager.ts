import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type EventStructure } from "@structures/index.js";
import { type CustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class EventManager extends BaseManager {
    public events: Collection<CustomId, EventStructure> = new Collection();

    constructor(client: StelliaClient, directoryPath: string) {
        super(client, directoryPath);
    }

    public async loadData(): Promise<void> {
        const events = await requiredFiles<EventStructure>(this.directoryPath);
        this.events = events;

        for (const event of this.events.values()) {
            const { name, once } = event.data;
            if (once) {
                this.client.once(name, (...args) => event.execute(this.client, ...args));
            } else {
                this.client.on(name, (...args) => event.execute(this.client, ...args));
            }
        }
    }

    public get<EventStructure>(id: CustomId): EventStructure | undefined {
        const event = this.events.get(id) as EventStructure ?? undefined;
        return event;
    }

    public getAll<EventStructure>(): Collection<CustomId, EventStructure> {
        const events = this.events as Collection<CustomId, EventStructure>;
        return events;
    }
}