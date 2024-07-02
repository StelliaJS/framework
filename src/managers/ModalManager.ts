import { Collection } from "discord.js";
import { type StellaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ModalStructure } from "@structures/index.js";
import { type CustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class ModalManager extends BaseManager {
    public modals: Collection<CustomId, ModalStructure> = new Collection();

    constructor(client: StellaClient, directory: string) {
        super(client, directory);
    }

    public async loadData(): Promise<void> {
        const modals = await requiredFiles<ModalStructure>(this.directoryPath,);
        this.modals = modals;
    }

    public get<ModalStructure>(id: CustomId): ModalStructure | undefined {
        const modal = this.modals.get(id) as ModalStructure ?? undefined;
        return modal;
    }

    public getAll<ModalStructure>(): Collection<CustomId, ModalStructure> {
        const modals = this.modals as Collection<CustomId, ModalStructure>;
        return modals;
    }
}