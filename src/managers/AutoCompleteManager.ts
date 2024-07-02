import { Collection } from "discord.js";
import { type StellaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { AutoCompleteStructure } from "@structures/index.js";
import { type CustomId } from "@typescript/index.js";
import { loadFiles, requiredFiles } from "@utils/index.js";

export class AutoCompleteManager extends BaseManager {
    private autoCompletes: Collection<CustomId, AutoCompleteStructure> = new Collection();

    constructor(client: StellaClient, directory: string) {
        super(client, directory);
    }

    public loadData(): void {
        const autoCompletes = requiredFiles<AutoCompleteStructure>(this.directory, loadFiles);
        this.autoCompletes = autoCompletes;
    }

    public get<AutoCompleteStructure>(id: CustomId): AutoCompleteStructure | undefined {
        const autoComplete = this.autoCompletes.get(id) as AutoCompleteStructure ?? undefined;
        return autoComplete;
    }

    public getAll<AutoCompleteStructure>(): Collection<CustomId, AutoCompleteStructure> {
        const autoCompletes = this.autoCompletes as Collection<CustomId, AutoCompleteStructure>;
        return autoCompletes;
    }
}