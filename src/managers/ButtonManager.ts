import { Collection } from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { type ButtonStructure } from "@structures/index.js";
import { type StructureCustomId, type InteractionCustomId } from "@typescript/index.js";
import { requiredFiles } from "@utils/index.js";

export class ButtonManager extends BaseManager {
    public interactions: Collection<StructureCustomId, ButtonStructure> = new Collection();

    constructor(client: StelliaClient, directory: string) {
        super(client, directory);
    }

    public async loadData(): Promise<void> {
        const buttons = await requiredFiles<ButtonStructure>(this.directoryPath);
        this.interactions = buttons;
    }

    public getByCustomId<ButtonStructure>(id: InteractionCustomId): ButtonStructure | undefined {
        const button = this.interactions.get(id) as ButtonStructure ?? undefined;
        return button;
    }

    public getAll<ButtonStructure>(): Collection<CustomId, ButtonStructure> {
        const buttons = this.buttons as Collection<CustomId, ButtonStructure>;
        return buttons;
    }
}