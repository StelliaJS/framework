import { Client, type ClientOptions, Events } from "discord.js";
import {
    AutoCompleteManager,
    ButtonManager,
    CommandManager,
    ContextMenuManager,
    EventManager,
    SelectMenuManager,
    ModalManager
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
        this.autoCompletes = new AutoCompleteManager(this, stellaOptions.autoCompletes.directory);
        this.buttons = new ButtonManager(this, stellaOptions.buttons.directory);
        this.commands = new CommandManager(this, stellaOptions.commands.directory);
        this.contextMenus = new ContextMenuManager(this, stellaOptions.contextMenus.directory);
        this.events = new EventManager(this, stellaOptions.events.directory);
        this.selectMenus = new SelectMenuManager(this, stellaOptions.selectMenus.directory);
        this.modals = new ModalManager(this, stellaOptions.modals.directory);
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
    autoCompletes: {
        directory: string;
    },
    buttons: {
        directory: string;
    },
    commands: {
        directory: string;
    },
    contextMenus: {
        directory: string;
    },
    events: {
        directory: string;
    },
    selectMenus: {
        directory: string;
    },
    modals: {
        directory: string;
    }
}