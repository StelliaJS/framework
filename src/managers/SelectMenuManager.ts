import { Collection } from "discord.js";
import { type StellaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type SelectMenuStructure } from "@structures/index.js";
import { type CustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class SelectMenuManager extends BaseManager {
    public selectMenus: Collection<CustomId, SelectMenuStructure> = new Collection();

    constructor(client: StellaClient, directory: string) {
        super(client, directory);
    }

    public async loadData(): Promise<void> {
        const selectMenus = await requiredFiles<SelectMenuStructure>(this.directoryPath);
        this.selectMenus = selectMenus;
    }

    public get<SelectMenuStructure>(id: CustomId): SelectMenuStructure | undefined {
        const selectMenu = this.selectMenus.get(id) as SelectMenuStructure ?? undefined;
        return selectMenu;
    }

    public getAll<SelectMenuStructure>(): Collection<CustomId, SelectMenuStructure> {
        const selectMenus = this.selectMenus as Collection<CustomId, SelectMenuStructure>;
        return selectMenus;
    }
}