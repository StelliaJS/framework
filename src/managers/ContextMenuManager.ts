import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ContextMenuStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { logger, requiredFiles } from "@utils/index.js";

export class ContextMenuManager extends BaseManager<ContextMenuStructure> {
	private contextMenus: Collection<StructureCustomId, ContextMenuStructure> = new Collection();

	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath);
	}

	public static async create(client: StelliaClient, directory: string): Promise<ContextMenuManager> {
		const manager = new ContextMenuManager(client, directory);
		await manager.loadData();

		return manager;
	}

	public async loadData(): Promise<void> {
		this.contextMenus = await requiredFiles<ContextMenuStructure>(this.directoryPath);
		this.setManagerLoaded();

		logger.info(`Loaded ${this.contextMenus.size} context menus`);
	}

	public getByCustomId(id: InteractionCustomId): ContextMenuStructure | null {
		return this.contextMenus.get(id) ?? null;
	}

	public getByRegex(id: InteractionCustomId): ContextMenuStructure | null {
		let contextMenu: ContextMenuStructure | null = null;
		for (const [customId, action] of this.contextMenus.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				contextMenu = action;
				break;
			}
		}

		return contextMenu;
	}

	public getAll(): Collection<StructureCustomId, ContextMenuStructure> {
		return this.contextMenus;
	}
}
