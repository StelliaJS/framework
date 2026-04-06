import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ButtonStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class ButtonManager extends BaseManager<ButtonStructure> {
	public interactions: Collection<StructureCustomId, ButtonStructure> = new Collection();

	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath);
	}

	public static async create(client: StelliaClient, directory: string): Promise<ButtonManager> {
		const manager = new ButtonManager(client, directory);
		await manager.loadData();

		return manager;
	}

	public async loadData(): Promise<void> {
		const buttons = await requiredFiles<ButtonStructure>(this.directoryPath);
		this.interactions = buttons;
		this.setManagerLoaded();
	}

	public getByCustomId(id: InteractionCustomId): ButtonStructure | null {
		return this.interactions.get(id) ?? null;
	}

	public getByRegex(id: InteractionCustomId): ButtonStructure | null {
		let button: ButtonStructure | null = null;
		for (const [customId, action] of this.interactions.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				button = action;
				break;
			}
		}

		return button;
	}

	public getAll(): Collection<StructureCustomId, ButtonStructure> {
		return this.interactions;
	}
}
