import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ModalStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class ModalManager extends BaseManager {
	private interactions: Collection<StructureCustomId, ModalStructure> = new Collection();

    private constructor(client: StelliaClient, directoryPath: string) {
        super(client, directoryPath);
    }

    public static async create(client: StelliaClient, directory: string): Promise<ModalManager> {
        const manager = new ModalManager(client, directory);
        await manager.loadData();

        return manager;
    }

	public async loadData(): Promise<void> {
		const modals = await requiredFiles<ModalStructure>(this.directoryPath);
		this.interactions = modals;
		this.setManagerLoaded();
	}

	public getByCustomId<ModalStructure>(id: InteractionCustomId): ModalStructure | null {
		const modal = (this.interactions.get(id) as ModalStructure) ?? null;
		return modal;
	}

	public getByRegex<ModalStructure>(id: InteractionCustomId): ModalStructure | null {
		let modal = null;
		for (const [customId, action] of this.interactions.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				modal = action as ModalStructure;
				break;
			}
		}

		return modal;
	}

	public getAll<ModalStructure>(): Collection<StructureCustomId, ModalStructure> {
		const modals = this.interactions as Collection<StructureCustomId, ModalStructure>;
		return modals;
	}
}
