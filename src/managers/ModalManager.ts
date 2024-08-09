import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ModalStructure } from "@structures/index.js";
import { type StructureCustomId, type InteractionCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class ModalManager extends BaseManager {
    public interactions: Collection<StructureCustomId, ModalStructure> = new Collection();

    constructor(client: StelliaClient, directory: string) {
        super(client, directory);
    }

    public async loadData(): Promise<void> {
        const modals = await requiredFiles<ModalStructure>(this.directoryPath,);
        this.interactions = modals;
    }

    public getByCustomId<ModalStructure>(id: InteractionCustomId): ModalStructure | undefined {
        const modal = this.interactions.get(id) as ModalStructure ?? undefined;
        return modal;
    }

    public getAll<ModalStructure>(): Collection<CustomId, ModalStructure> {
        const modals = this.modals as Collection<CustomId, ModalStructure>;
        return modals;
    }
}