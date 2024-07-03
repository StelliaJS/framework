import { Client, type ClientOptions, Events } from "discord.js";
import {
    AutoCompleteManager,
    ButtonManager,
    CommandManager,
    ContextMenuManager,
    EventManager,
    type ManagerOptions,
    ModalManager,
    SelectMenuManager
} from "@managers/index.js";

export class StelliaClient extends Client {
    public readonly autoCompletes: AutoCompleteManager;
    public readonly buttons: ButtonManager;
    public readonly commands: CommandManager;
    public readonly contextMenus: ContextMenuManager;
    public readonly events: EventManager;
    public readonly selectMenus: SelectMenuManager;
    public readonly modals: ModalManager;

    public constructor(clientOptions: ClientOptions, stelliaOptions: StelliaOptions) {
        super(clientOptions);
        this.autoCompletes = new AutoCompleteManager(this, stelliaOptions.autoCompletes.directoryPath);
        this.buttons = new ButtonManager(this, stelliaOptions.buttons.directoryPath);
        this.commands = new CommandManager(this, stelliaOptions.commands.directoryPath);
        this.contextMenus = new ContextMenuManager(this, stelliaOptions.contextMenus.directoryPath);
        this.events = new EventManager(this, stelliaOptions.events.directoryPath);
        this.selectMenus = new SelectMenuManager(this, stelliaOptions.selectMenus.directoryPath);
        this.modals = new ModalManager(this, stelliaOptions.modals.directoryPath);
    }

    public connect = async (token: string): Promise<void> => {
        this.on(Events.Error, (error) => console.error(error));
        await this.login(token);

        process.on("unhandledRejection", (error: string) => {
            console.error(`Unhandled promise rejection: ${error}`);
        });
    }
}

interface StelliaOptions {
    autoCompletes: ManagerOptions;
    buttons: ManagerOptions;
    commands: ManagerOptions;
    contextMenus: ManagerOptions;
    events: ManagerOptions;
    selectMenus: ManagerOptions;
    modals: ManagerOptions;
}