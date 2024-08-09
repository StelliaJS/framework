import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ContextMenuStructure } from "@structures/index.js";
import { type StructureCustomId, type InteractionCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class ContextMenuManager extends BaseManager {
    public interactions: Collection<StructureCustomId, ContextMenuStructure> = new Collection();

    constructor(client: StelliaClient, directory: string) {
        super(client, directory);
    }

    public async loadData(): Promise<void> {
        const contextMenus = await requiredFiles<ContextMenuStructure>(this.directoryPath);
        this.interactions = contextMenus;
    }

    public getByCustomId<ContextMenuStructure>(id: InteractionCustomId): ContextMenuStructure | undefined {
        const contextMenu = this.interactions.get(id) as ContextMenuStructure ?? undefined;
        return contextMenu;
    }

    public getAll<ContextMenuStructure>(): Collection<CustomId, ContextMenuStructure> {
        const contextMenus = this.contextMenus as Collection<CustomId, ContextMenuStructure>;
        return contextMenus;
    }
}