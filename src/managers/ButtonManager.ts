import { type StelliaClient } from "@client/index.js";
import { SimpleManager } from "@managers/index.js";
import { type ButtonStructure } from "@structures/index.js";

export class ButtonManager extends SimpleManager<ButtonStructure> {
	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath, "buttons");
	}

	public static async create(client: StelliaClient, directoryPath: string): Promise<ButtonManager> {
		const manager = new ButtonManager(client, directoryPath);
		await manager.loadData();

		return manager;
	}
}
