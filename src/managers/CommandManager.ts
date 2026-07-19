import { type StelliaClient } from "@client/index.js";
import { SimpleManager } from "@managers/index.js";
import { type CommandStructure } from "@structures/index.js";

export class CommandManager extends SimpleManager<CommandStructure> {
	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath, "commands");
	}

	public static async create(client: StelliaClient, directoryPath: string): Promise<CommandManager> {
		const manager = new CommandManager(client, directoryPath);
		await manager.loadData();

		return manager;
	}
}
