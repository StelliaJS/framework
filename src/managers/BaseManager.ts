import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { type StructureCustomId, type InteractionCustomId } from "@typescript/index.js";
import { type AnyInteractionStructure } from "@structures/index.js";

export interface ManagerOptions {
    directoryPath: string;
}

export abstract class BaseManager {
    public readonly client: StelliaClient;
    public readonly directoryPath: string;
    private isLoaded = false;

    constructor(client: StelliaClient, directory: string) {
        this.client = client;
        this.directoryPath = directory;
        this.loadData();
    }

    public isManagerLoaded(): boolean {
        return this.isLoaded;
    }

    public setManagerLoaded(): void {
        this.isLoaded = true;
    }

    public abstract loadData(): void;
    public abstract getByCustomId<InteractionStructure extends AnyInteractionStructure>(id: InteractionCustomId): InteractionStructure | undefined;
    public abstract getByRegex<InteractionStructure extends AnyInteractionStructure>(id: InteractionCustomId): InteractionStructure | undefined;
    public abstract getAll<InteractionStructure extends AnyInteractionStructure>(): Collection<StructureCustomId, InteractionStructure>;
}