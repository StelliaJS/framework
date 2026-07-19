import { type StelliaClient } from "@client/index.js";
import { SimpleManager } from "@managers/index.js";
import { type SelectMenuStructure } from "@structures/index.js";

export class SelectMenuManager extends SimpleManager<SelectMenuStructure> {
	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath, "select menus");
	}

	public static async create(client: StelliaClient, directoryPath: string): Promise<SelectMenuManager> {
		const manager = new SelectMenuManager(client, directoryPath);
		await manager.loadData();

		return manager;
	}
}
