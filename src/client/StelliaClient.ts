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
import { StelliaUtils } from "@client/index.js";
import { type AnyInteraction, Manager, type Managers } from "@typescript/index.js";

export class StelliaClient<Ready extends boolean = boolean> extends Client<Ready> {
    private readonly utils: StelliaUtils;
    public readonly managers: Managers = {};

    public constructor(clientOptions: ClientOptions, stelliaOptions?: StelliaOptions) {
        super(clientOptions);
        this.utils = new StelliaUtils(this);

        if (stelliaOptions?.autoCompletes?.directoryPath) {
            this.managers.autoCompletes = new AutoCompleteManager(this, stelliaOptions.autoCompletes.directoryPath);
        }

        if (stelliaOptions?.buttons?.directoryPath) {
            this.managers.buttons = new ButtonManager(this, stelliaOptions.buttons.directoryPath);
        }

        if (stelliaOptions?.commands?.directoryPath) {
            this.managers.commands = new CommandManager(this, stelliaOptions.commands.directoryPath);
        }

        if (stelliaOptions?.contextMenus?.directoryPath) {
            this.managers.contextMenus = new ContextMenuManager(this, stelliaOptions.contextMenus.directoryPath);
        }

        if (stelliaOptions?.events?.directoryPath) {
            this.managers.events = new EventManager(this, stelliaOptions.events.directoryPath);
        }

        if (stelliaOptions?.selectMenus?.directoryPath) {
            this.managers.selectMenus = new SelectMenuManager(this, stelliaOptions.selectMenus.directoryPath);
        }

        if (stelliaOptions?.modals?.directoryPath) {
            this.managers.modals = new ModalManager(this, stelliaOptions.modals.directoryPath);
        }
    }

    public connect = async (token: string): Promise<void> => {
        this.on(Events.Error, (error) => console.error(error));

        await Promise.all(Object.values(this.managers).map((manager: Manager) => {
            return new Promise<void>((resolve) => {
                const checkLoaded = () => {
                    if (manager.isManagerLoaded()) {
                        resolve();
                    } else {
                        setTimeout(checkLoaded, 500);
                    }
                };
                checkLoaded();
            });
        }));

        await this.login(token);

        process.on("unhandledRejection", (error: string) => {
            console.error(`Unhandled promise rejection: ${error}`);
        });
    }

    public initializeCommands = async (): Promise<void> => {
        await this.utils.initializeCommands();
    }

    public handleInteraction = async (interaction: AnyInteraction): Promise<void> => {
        await this.utils.handleInteraction(interaction);
    }
}

interface StelliaOptions {
    autoCompletes?: ManagerOptions;
    buttons?: ManagerOptions;
    commands?: ManagerOptions;
    contextMenus?: ManagerOptions;
    events?: ManagerOptions;
    selectMenus?: ManagerOptions;
    modals?: ManagerOptions;
}

