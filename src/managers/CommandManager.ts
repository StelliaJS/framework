import { Collection } from "discord.js";
import { type StellaClient } from "@client/index.js";
import { BaseManager } from "@managers/index.js";
import { CommandStructure } from "@structures/index.js";
import { type CustomId } from "@typescript/index.js";
import { loadFiles, requiredFiles } from "@utils/index.js";

export class CommandManager extends BaseManager {
    public commands: Collection<CustomId, CommandStructure> = new Collection();

    constructor(client: StellaClient, directory: string) {
        super(client, directory);
    }

    public loadData(): void {
        const commands = requiredFiles<CommandStructure>(this.directory, loadFiles);
        this.commands = commands;
    }

    public get<CommandStructure>(id: CustomId): CommandStructure | undefined {
        const command = this.commands.get(id) as CommandStructure ?? undefined;
        return command;
    }

    public getAll<CommandStructure>(): Collection<CustomId, CommandStructure> {
        const commands = this.commands as Collection<CustomId, CommandStructure>;
        return commands;
    }
}