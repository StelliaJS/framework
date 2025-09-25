import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ButtonStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class ButtonManager extends BaseManager {
	public interactions: Collection<StructureCustomId, ButtonStructure> = new Collection();

	constructor(client: StelliaClient, directory: string) {
		super(client, directory);
	}

	public async loadData(): Promise<void> {
		const buttons = await requiredFiles<ButtonStructure>(this.directoryPath);
		this.interactions = buttons;
		this.setManagerLoaded();
	}

	public getByCustomId<ButtonStructure>(id: InteractionCustomId): ButtonStructure | null {
		const button = (this.interactions.get(id) as ButtonStructure) ?? null;
		return button;
	}

	public getByRegex<ButtonStructure>(id: InteractionCustomId): ButtonStructure | null {
		let button = null;
		for (const [customId, action] of this.interactions.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				button = action as ButtonStructure;
				break;
			}
		}

		return button;
	}

	public getAll<ButtonStructure>(): Collection<StructureCustomId, ButtonStructure> {
		const buttons = this.interactions as Collection<StructureCustomId, ButtonStructure>;
		return buttons;
	}
}
