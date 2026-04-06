import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type AutoCompleteStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class AutoCompleteManager extends BaseManager<AutoCompleteStructure> {
	private interactions: Collection<StructureCustomId, AutoCompleteStructure> = new Collection();

	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath);
	}

	public static async create(client: StelliaClient, directory: string): Promise<AutoCompleteManager> {
		const manager = new AutoCompleteManager(client, directory);
		await manager.loadData();

		return manager;
	}

	public async loadData(): Promise<void> {
		const autoCompletes = await requiredFiles<AutoCompleteStructure>(this.directoryPath);
		this.interactions = autoCompletes;
		this.setManagerLoaded();
	}

	public getByCustomId(id: InteractionCustomId): AutoCompleteStructure | null {
		return this.interactions.get(id) ?? null;
	}

	public getByRegex(id: InteractionCustomId): AutoCompleteStructure | null {
		let autoComplete: AutoCompleteStructure | null = null;
		for (const [customId, action] of this.interactions.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				autoComplete = action;
				break;
			}
		}

		return autoComplete;
	}

	public getAll(): Collection<StructureCustomId, AutoCompleteStructure> {
		return this.interactions;
	}
}
