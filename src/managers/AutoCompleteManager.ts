import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type AutoCompleteStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { logger, requiredFiles } from "@utils/index.js";

export class AutoCompleteManager extends BaseManager<AutoCompleteStructure> {
	private autoCompletes: Collection<StructureCustomId, AutoCompleteStructure> = new Collection();

	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath);
	}

	public static async create(client: StelliaClient, directory: string): Promise<AutoCompleteManager> {
		const manager = new AutoCompleteManager(client, directory);
		await manager.loadData();

		return manager;
	}

	public async loadData(): Promise<void> {
		this.autoCompletes = await requiredFiles<AutoCompleteStructure>(this.directoryPath);
		this.setManagerLoaded();

		logger.info(`Loaded ${this.autoCompletes.size} auto complete`);
	}

	public getByCustomId(id: InteractionCustomId): AutoCompleteStructure | null {
		return this.autoCompletes.get(id) ?? null;
	}

	public getByRegex(id: InteractionCustomId): AutoCompleteStructure | null {
		let autoComplete: AutoCompleteStructure | null = null;
		for (const [customId, action] of this.autoCompletes.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				autoComplete = action;
				break;
			}
		}

		return autoComplete;
	}

	public getAll(): Collection<StructureCustomId, AutoCompleteStructure> {
		return this.autoCompletes;
	}
}
