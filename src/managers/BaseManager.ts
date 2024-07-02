import { StellaClient } from "@client/index.js";
import { Collection } from "discord.js";
import { CustomId } from "@typescript/index.js";

export abstract class BaseManager {
    public readonly client: StellaClient;
    public readonly directory: string;

    constructor(client: StellaClient, directory: string) {
        this.client = client;
        this.directory = directory;
    }

    public abstract loadData(): void;
    public abstract get<T>(id: CustomId): T | undefined;
    public abstract getAll<T>(): Collection<CustomId, T>;
}