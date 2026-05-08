import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type SelectMenuStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { logger, requiredFiles } from "@utils/index.js";

export class SelectMenuManager extends BaseManager<SelectMenuStructure> {
	private selectMenus: Collection<StructureCustomId, SelectMenuStructure> = new Collection();

	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath);
	}

	public static async create(client: StelliaClient, directory: string): Promise<SelectMenuManager> {
		const manager = new SelectMenuManager(client, directory);
		await manager.loadData();

		return manager;
	}

	public async loadData(): Promise<void> {
		this.selectMenus = await requiredFiles<SelectMenuStructure>(this.directoryPath);
		this.setManagerLoaded();

		logger.info(`Loaded ${this.selectMenus.size} select menus`);
	}

	public getByCustomId(id: InteractionCustomId): SelectMenuStructure | null {
		return this.selectMenus.get(id) ?? null;
	}

	public getByRegex(id: InteractionCustomId): SelectMenuStructure | null {
		let selectMenu: SelectMenuStructure | null = null;
		for (const [customId, action] of this.selectMenus.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				selectMenu = action;
				break;
			}
		}

		return selectMenu;
	}

	public getAll(): Collection<StructureCustomId, SelectMenuStructure> {
		return this.selectMenus;
	}
}
