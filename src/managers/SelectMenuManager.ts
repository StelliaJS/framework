import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type SelectMenuStructure } from "@structures/index.js";
import { type StructureCustomId, type InteractionCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class SelectMenuManager extends BaseManager {
    public interactions: Collection<StructureCustomId, SelectMenuStructure> = new Collection();

    constructor(client: StelliaClient, directory: string) {
        super(client, directory);
    }

    public async loadData(): Promise<void> {
        const selectMenus = await requiredFiles<SelectMenuStructure>(this.directoryPath);
        this.interactions = selectMenus;
    }

    public getByCustomId<SelectMenuStructure>(id: InteractionCustomId): SelectMenuStructure | undefined {
        const selectMenu = this.interactions.get(id) as SelectMenuStructure ?? undefined;
        return selectMenu;
    }

    public getAll<SelectMenuStructure>(): Collection<CustomId, SelectMenuStructure> {
        const selectMenus = this.selectMenus as Collection<CustomId, SelectMenuStructure>;
        return selectMenus;
    }
}