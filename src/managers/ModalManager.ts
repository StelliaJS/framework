import { type StelliaClient } from "@client/index.js";
import { SimpleManager } from "@managers/index.js";
import { type ModalStructure } from "@structures/index.js";

export class ModalManager extends SimpleManager<ModalStructure> {
	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath, "modals");
	}

	public static async create(client: StelliaClient, directoryPath: string): Promise<ModalManager> {
		const manager = new ModalManager(client, directoryPath);
		await manager.loadData();

		return manager;
	}
}
