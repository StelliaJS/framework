import { Collection } from "discord.js";
import { type StellaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { ContextMenuStructure } from "@structures/index.js";
import { type CustomId } from "@typescript/index.js";
import { loadFiles, requiredFiles } from "@utils/index.js";

export class ContextMenuManager extends BaseManager {
    public contextMenus: Collection<CustomId, ContextMenuStructure> = new Collection();

    constructor(client: StellaClient, directory: string) {
        super(client, directory);
    }

    public loadData(): void {
        const contextMenus = requiredFiles<ContextMenuStructure>(this.directory, loadFiles);
        this.contextMenus = contextMenus;
    }

    public get<ContextMenuStructure>(id: CustomId): ContextMenuStructure | undefined {
        const contextMenu = this.contextMenus.get(id) as ContextMenuStructure ?? undefined;
        return contextMenu;
    }

    public getAll<ContextMenuStructure>(): Collection<CustomId, ContextMenuStructure> {
        const contextMenus = this.contextMenus as Collection<CustomId, ContextMenuStructure>;
        return contextMenus;
    }
}