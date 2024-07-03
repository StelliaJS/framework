import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { type CustomId } from "@typescript/index.js";
import { type AnyInteractionStructure } from "@structures/Interaction.js";

export interface ManagerOptions {
    directoryPath: string;
}

export abstract class BaseManager {
    public readonly client: StelliaClient;
    public readonly directoryPath: string;

    constructor(client: StelliaClient, directory: string) {
        this.client = client;
        this.directoryPath = directory;
        this.loadData();
    }

    public abstract loadData(): void;
    public abstract get<InteractionStructure extends AnyInteractionStructure>(id: CustomId): InteractionStructure | undefined;
    public abstract getAll<InteractionStructure extends AnyInteractionStructure>(): Collection<CustomId, InteractionStructure>;
}