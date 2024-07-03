import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type AutoCompleteStructure } from "@structures/index.js";
import { type CustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class AutoCompleteManager extends BaseManager {
    private autoCompletes: Collection<CustomId, AutoCompleteStructure> = new Collection();

    constructor(client: StelliaClient, directory: string) {
        super(client, directory);
    }

    public async loadData(): Promise<void> {
        const autoCompletes = await requiredFiles<AutoCompleteStructure>(this.directoryPath);
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