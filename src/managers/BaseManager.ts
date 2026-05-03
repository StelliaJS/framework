import { type Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { type AnyInteractionStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";

export interface ManagerOptions {
	directoryPath: string;
}

export abstract class BaseManager<TStructure extends AnyInteractionStructure> {
	public readonly client: StelliaClient;
	public readonly directoryPath: string;
	private isLoaded = false;

	protected constructor(client: StelliaClient, directory: string) {
		this.client = client;
		this.directoryPath = directory;
	}

	public isManagerLoaded(): boolean {
		return this.isLoaded;
	}

	public setManagerLoaded(): void {
		this.isLoaded = true;
	}

	public abstract loadData(): Promise<void>;
	public abstract getByCustomId(id: InteractionCustomId): TStructure | null;
	public abstract getByRegex(id: InteractionCustomId): TStructure | null;
	public abstract getAll(): Collection<StructureCustomId, TStructure>;
}
