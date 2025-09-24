import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ContextMenuStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class ContextMenuManager extends BaseManager {
	private interactions: Collection<StructureCustomId, ContextMenuStructure> = new Collection();

	constructor(client: StelliaClient, directory: string) {
		super(client, directory);
	}

	public async loadData(): Promise<void> {
		const contextMenus = await requiredFiles<ContextMenuStructure>(this.directoryPath);
		this.interactions = contextMenus;
		this.setManagerLoaded();
	}

	public getByCustomId<ContextMenuStructure>(id: InteractionCustomId): ContextMenuStructure | null {
		const contextMenu = (this.interactions.get(id) as ContextMenuStructure) ?? null;
		return contextMenu;
	}

	public getByRegex<ContextMenuStructure>(id: InteractionCustomId): ContextMenuStructure | null {
        let contextMenu = null;
        for (const [customId, action] of this.interactions.entries()) {
            if (customId instanceof RegExp && customId.test(id)) {
                contextMenu = action as ContextMenuStructure;
                break;
            }
        }

        return contextMenu;
	}

	public getAll<ContextMenuStructure>(): Collection<StructureCustomId, ContextMenuStructure> {
		const contextMenus = this.interactions as Collection<StructureCustomId, ContextMenuStructure>;
		return contextMenus;
	}
}
