import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type CommandStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class CommandManager extends BaseManager {
	private interactions: Collection<StructureCustomId, CommandStructure> = new Collection();

	constructor(client: StelliaClient, directory: string) {
		super(client, directory);
	}

	public async loadData(): Promise<void> {
		const commands = await requiredFiles<CommandStructure>(this.directoryPath);
		this.interactions = commands;
		this.setManagerLoaded();
	}

	public getByCustomId<CommandStructure>(id: InteractionCustomId): CommandStructure | undefined {
		const command = (this.interactions.get(id) as CommandStructure) ?? undefined;
		return command;
	}

	public getByRegex<CommandStructure>(id: InteractionCustomId): CommandStructure | undefined {
		return undefined;
	}

	public getAll<CommandStructure>(): Collection<StructureCustomId, CommandStructure> {
		const commands = this.interactions as Collection<StructureCustomId, CommandStructure>;
		return commands;
	}
}
