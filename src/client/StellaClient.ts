import { Client, type ClientOptions, Events } from "discord.js";
import {
    AutoCompleteManager,
    ButtonManager,
    CommandManager,
    ContextMenuManager,
    EventManager,
    SelectMenuManager,
    ModalManager,
    ManagerOptions
} from "@managers/index.js";

export class StellaClient extends Client {
    public readonly autoCompletes: AutoCompleteManager;
    public readonly buttons: ButtonManager;
    public readonly commands: CommandManager;
    public readonly contextMenus: ContextMenuManager;
    public readonly events: EventManager;
    public readonly selectMenus: SelectMenuManager;
    public readonly modals: ModalManager;

    public constructor(clientOptions: ClientOptions, stellaOptions: StellaOptions) {
        super(clientOptions);
        this.autoCompletes = new AutoCompleteManager(this, stellaOptions.autoCompletes.directoryPath);
        this.buttons = new ButtonManager(this, stellaOptions.buttons.directoryPath);
        this.commands = new CommandManager(this, stellaOptions.commands.directoryPath);
        this.contextMenus = new ContextMenuManager(this, stellaOptions.contextMenus.directoryPath);
        this.events = new EventManager(this, stellaOptions.events.directoryPath);
        this.selectMenus = new SelectMenuManager(this, stellaOptions.selectMenus.directoryPath);
        this.modals = new ModalManager(this, stellaOptions.modals.directoryPath);
    }

    public connect = async (token: string): Promise<void> => {
        this.on(Events.Error, (error) => console.error(error));
        await this.login(token);

        process.on("unhandledRejection", (error: string) => {
            console.error(`Unhandled promise rejection: ${error}`);
        });
    }
}

interface StellaOptions {
    autoCompletes: ManagerOptions;
    buttons: ManagerOptions;
    commands: ManagerOptions;
    contextMenus: ManagerOptions;
    events: ManagerOptions;
    selectMenus: ManagerOptions;
    modals: ManagerOptions;
}