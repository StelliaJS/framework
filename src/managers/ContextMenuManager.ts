import { type StelliaClient } from "@client/index.js";
import { SimpleManager } from "@managers/index.js";
import { type ContextMenuStructure } from "@structures/index.js";

export class ContextMenuManager extends SimpleManager<ContextMenuStructure> {
	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath, "context menus");
	}

	public static async create(client: StelliaClient, directoryPath: string): Promise<ContextMenuManager> {
		const manager = new ContextMenuManager(client, directoryPath);
		await manager.loadData();

		return manager;
	}
}
