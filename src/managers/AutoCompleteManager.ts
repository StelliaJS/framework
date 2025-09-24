import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type AutoCompleteStructure } from "@structures/index.js";
import { type InteractionCustomId, type StructureCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class AutoCompleteManager extends BaseManager {
	private interactions: Collection<StructureCustomId, AutoCompleteStructure> = new Collection();

	constructor(client: StelliaClient, directory: string) {
		super(client, directory);
	}

	public async loadData(): Promise<void> {
		const autoCompletes = await requiredFiles<AutoCompleteStructure>(this.directoryPath);
		this.interactions = autoCompletes;
		this.setManagerLoaded();
	}

	public getByCustomId<AutoCompleteStructure>(id: InteractionCustomId): AutoCompleteStructure | null {
		const autoComplete = (this.interactions.get(id) as AutoCompleteStructure) ?? null;
		return autoComplete;
	}

	public getByRegex<AutoCompleteStructure>(id: InteractionCustomId): AutoCompleteStructure | null {
        let autoComplete = null;
        for (const [customId, action] of this.interactions.entries()) {
            if (customId instanceof RegExp && customId.test(id)) {
                autoComplete = action as AutoCompleteStructure;
                break;
            }
        }

        return autoComplete;
	}

	public getAll<AutoCompleteStructure>(): Collection<StructureCustomId, AutoCompleteStructure> {
		const autoCompletes = this.interactions as Collection<StructureCustomId, AutoCompleteStructure>;
		return autoCompletes;
	}
}
