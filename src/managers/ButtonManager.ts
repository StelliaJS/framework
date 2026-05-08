import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ButtonStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { logger, requiredFiles } from "@utils/index.js";

export class ButtonManager extends BaseManager<ButtonStructure> {
	public buttons: Collection<StructureCustomId, ButtonStructure> = new Collection();

	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath);
	}

	public static async create(client: StelliaClient, directory: string): Promise<ButtonManager> {
		const manager = new ButtonManager(client, directory);
		await manager.loadData();

		return manager;
	}

	public async loadData(): Promise<void> {
		this.buttons = await requiredFiles<ButtonStructure>(this.directoryPath);
		this.setManagerLoaded();

		logger.info(`Loaded ${this.buttons.size} buttons`);
	}

	public getByCustomId(id: InteractionCustomId): ButtonStructure | null {
		return this.buttons.get(id) ?? null;
	}

	public getByRegex(id: InteractionCustomId): ButtonStructure | null {
		let button: ButtonStructure | null = null;
		for (const [customId, action] of this.buttons.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				button = action;
				break;
			}
		}

		return button;
	}

	public getAll(): Collection<StructureCustomId, ButtonStructure> {
		return this.buttons;
	}
}
