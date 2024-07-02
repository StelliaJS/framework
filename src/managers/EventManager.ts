import { Collection } from "discord.js";
import { type StellaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { EventStructure } from "@structures/index.js";
import { type CustomId } from "@typescript/index.js";
import { loadFiles, requiredFiles } from "@utils/index.js";

export class EventManager extends BaseManager {
    public events: Collection<CustomId, EventStructure> = new Collection();

    constructor(client: StellaClient, directory: string) {
        super(client, directory);
    }

    public loadData(): void {
        const events = requiredFiles<EventStructure>(this.directory, loadFiles);
        this.events = events;
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