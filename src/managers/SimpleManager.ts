import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type AnyInteractionStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { logger, requiredFiles } from "@utils/index.js";

export abstract class SimpleManager<TStructure extends AnyInteractionStructure> extends BaseManager<TStructure> {
	protected items: Collection<StructureCustomId, TStructure> = new Collection();

	protected constructor(client: StelliaClient, directoryPath: string, private readonly label: string) {
		super(client, directoryPath);
	}

	public async loadData(): Promise<void> {
		this.items = await requiredFiles<TStructure>(this.directoryPath);
		this.setManagerLoaded();

		logger.info(`Loaded ${this.items.size} ${this.label}`);
	}

	public getByCustomId(id: InteractionCustomId): TStructure | null {
		return this.items.get(id) ?? null;
	}

	public getByRegex(id: InteractionCustomId): TStructure | null {
		for (const [customId, structure] of this.items.entries()) {
			if (customId instanceof RegExp && customId.test(id)) {
				return structure;
			}
		}

		return null;
	}

	public getAll(): Collection<StructureCustomId, TStructure> {
		return this.items;
	}
}
