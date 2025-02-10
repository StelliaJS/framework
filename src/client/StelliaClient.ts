import { Client, type ClientOptions, type Interaction } from "discord.js";
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
import {
    type Environment,
    type EnvironmentConfiguration,
    type Manager,
    type Managers
} from "@typescript/index.js";
import path from "path";
import * as fs from "node:fs";
import { pathToFileURL } from "url";

export class StelliaClient<Ready extends boolean = boolean> extends Client<Ready> {
    private readonly utils: StelliaUtils;
    public readonly managers: Managers = {};
    public readonly environment: Environment;

    public constructor(clientOptions: ClientOptions, stelliaOptions?: StelliaOptions) {
        super(clientOptions);

        if (stelliaOptions?.managers.autoCompletes?.directoryPath) {
            this.managers.autoCompletes = new AutoCompleteManager(this, stelliaOptions.managers.autoCompletes.directoryPath);
        }

        if (stelliaOptions?.managers.buttons?.directoryPath) {
            this.managers.buttons = new ButtonManager(this, stelliaOptions.managers.buttons.directoryPath);
        }

        if (stelliaOptions?.managers.commands?.directoryPath) {
            this.managers.commands = new CommandManager(this, stelliaOptions.managers.commands.directoryPath);
        }

        if (stelliaOptions?.managers.contextMenus?.directoryPath) {
            this.managers.contextMenus = new ContextMenuManager(this, stelliaOptions.managers.contextMenus.directoryPath);
        }

        if (stelliaOptions?.managers.events?.directoryPath) {
            this.managers.events = new EventManager(this, stelliaOptions.managers.events.directoryPath);
        }

        if (stelliaOptions?.managers.selectMenus?.directoryPath) {
            this.managers.selectMenus = new SelectMenuManager(this, stelliaOptions.managers.selectMenus.directoryPath);
        }

        if (stelliaOptions?.managers.modals?.directoryPath) {
            this.managers.modals = new ModalManager(this, stelliaOptions.managers.modals.directoryPath);
        }

        if (stelliaOptions?.environment) {
            this.environment = stelliaOptions.environment;
        }

        this.utils = new StelliaUtils(this);

        process.on("unhandledRejection", (error: string) => {
            console.error(`Unhandled promise rejection: ${error}`);
        });
    }

    public connect = async (token: string): Promise<void> => {
        if (!this.areManagersLoaded()) {
            setTimeout(() => {
                console.log("Managers are not loaded yet, retrying in 500ms...");
                this.connect(token);
            }, 500);

            return;
        }

        console.log("Managers are loaded, connecting to Discord...");
        await this.login(token);
    }

    public initializeCommands = async (): Promise<void> => {
        await this.utils.initializeCommands();
    }

    public getEnvironment = async <CustomEnvironment extends EnvironmentConfiguration>(): Promise<CustomEnvironment> => {
        const chosenEnvironment = process.argv.find(arg => arg.startsWith("--config"))?.split("=")[1];
        if (!chosenEnvironment) {
            throw new Error("Environment not provided");
        }

        const srcPath = path.dirname(path.resolve(process.argv[1]));
        const filePath = path.join(srcPath, "..", "stellia.json");
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, async (err, data) => {
                if (err) {
                    return reject(err);
                }

                try {
                    const environments = JSON.parse(data.toString()).environments;
                    if (!Object.keys(environments).includes(chosenEnvironment)) {
                        return reject(new Error("Invalid environment"));
                    }

                    const environmentData = environments[chosenEnvironment];
                    const environmentPath = environmentData.production ? StelliaClient.convertFilePathToProduction(environmentData.file) : environmentData.file;
                    const environmentAbsolutePath = pathToFileURL(path.join(srcPath, "..", environmentPath)).href
                    const environmentFile = await import(environmentAbsolutePath);
                    resolve(environmentFile.environment);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    public handleInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        await this.utils.handleInteraction(interaction);
    }

    private areManagersLoaded = (): boolean => {
        const managers = Object.values(this.managers);

        return managers.length === 0 ? true : managers.every((manager: Manager) => manager.isManagerLoaded());
    }

    private static convertFilePathToProduction = (filePath: string): string => {
        return filePath.replace("src", "dist").replace(".ts", ".js");
    }
}

interface StelliaOptions {
    managers: {
        autoCompletes?: ManagerOptions;
        buttons?: ManagerOptions;
        commands?: ManagerOptions;
        contextMenus?: ManagerOptions;
        events?: ManagerOptions;
        selectMenus?: ManagerOptions;
        modals?: ManagerOptions;   
    },
    environment?: Environment;
}

