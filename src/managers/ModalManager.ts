import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ModalStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { logger, requiredFiles } from "@utils/index.js";

export class ModalManager extends BaseManager<ModalStructure> {
	private modals: Collection<StructureCustomId, ModalStructure> = new Collection();

	private constructor(client: StelliaClient, directoryPath: string) {
		super(client, directoryPath);
	}

	public static async create(client: StelliaClient, directory: string): Promise<ModalManager> {
		const manager = new ModalManager(client, directory);
		await manager.loadData();

		return manager;
	}

	public async loadData(): Promise<void> {
		this.modals = await requiredFiles<ModalStructure>(this.directoryPath);
		this.setManagerLoaded();

		logger.info(`Loaded ${this.modals.size} modals`);
	}

	public getByCustomId(id: InteractionCustomId): ModalStructure | null {
		return this.modals.get(id) ?? null;
	}

	public getByRegex(id: InteractionCustomId): ModalStructure | null {
		let modal: ModalStructure | null = null;
		for (const [customId, action] of this.modals.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				modal = action;
				break;
			}
		}

		return modal;
	}

	public getAll(): Collection<StructureCustomId, ModalStructure> {
		return this.modals;
	}
}
