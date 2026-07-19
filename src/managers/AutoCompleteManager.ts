import { type StelliaClient } from "@client/index.js";
import { SimpleManager } from "@managers/index.js";
import { type AutoCompleteStructure } from "@structures/index.js";

export class AutoCompleteManager extends SimpleManager<AutoCompleteStructure> {
	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath, "auto completes");
	}

	public static async create(client: StelliaClient, directoryPath: string): Promise<AutoCompleteManager> {
		const manager = new AutoCompleteManager(client, directoryPath);
		await manager.loadData();

		return manager;
	}
}
