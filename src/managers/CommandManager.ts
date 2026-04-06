import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type CommandStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class CommandManager extends BaseManager<CommandStructure> {
	private interactions: Collection<StructureCustomId, CommandStructure> = new Collection();

	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath);
	}

	public static async create(client: StelliaClient, directory: string): Promise<CommandManager> {
		const manager = new CommandManager(client, directory);
		await manager.loadData();

		return manager;
	}

	public async loadData(): Promise<void> {
		const commands = await requiredFiles<CommandStructure>(this.directoryPath);
		this.interactions = commands;
		this.setManagerLoaded();
	}

	public getByCustomId(id: InteractionCustomId): CommandStructure | null {
		return this.interactions.get(id) ?? null;
	}

	public getByRegex(id: InteractionCustomId): CommandStructure | null {
		let command: CommandStructure | null = null;
		for (const [customId, action] of this.interactions.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				command = action;
				break;
			}
		}

		return command;
	}

	public getAll(): Collection<StructureCustomId, CommandStructure> {
		return this.interactions;
	}
}
