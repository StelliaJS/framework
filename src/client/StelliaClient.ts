import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Client, type ClientOptions, type Interaction } from "discord.js";
import { StelliaUtils } from "@client/index.js";
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
import {
    type ClientEnvironment,
    type GuildConfiguration,
    type GuildsConfiguration,
    type Manager,
    type Managers
} from "@typescript/index.js";
import { logger } from "@utils/logger.js";

export class StelliaClient<Ready extends boolean = boolean> extends Client<Ready> {
	private utils: StelliaUtils;
	public readonly managers: Managers = {};
	public readonly environment?: ClientEnvironment;

    private constructor(clientOptions: ClientOptions, stelliaOptions?: StelliaOptions) {
        super(clientOptions);

        if (stelliaOptions?.environment) {
            this.environment = stelliaOptions.environment;
        }

        process.on("unhandledRejection", (error: Error) => {
            logger.error(`Unhandled promise rejection: ${error.stack}`);
        });

        process.on("uncaughtException", (error: Error) => {
            logger.error(`Uncaught exception: ${error.stack}`);
        });
    }

    public static async create(clientOptions: ClientOptions, stelliaOptions?: StelliaOptions): Promise<StelliaClient> {
        const client = new StelliaClient(clientOptions, stelliaOptions);
        await client.initializeAsyncFields(stelliaOptions);

        return client;
    }

	public connect = async (token: string): Promise<void> => {
		if (!this.areManagersLoaded()) {
			setTimeout(() => {
				logger.warn("Managers are not loaded yet, retrying in 500ms...");
				this.connect(token);
			}, 500);

			return;
		}

		logger.success("Managers are loaded, connecting to Discord...");
		await this.login(token);
	};

	public initializeCommands = async (): Promise<void> => {
		await this.utils.initializeCommands();
	};

	public getGuildsConfiguration = async <CustomGuildsConfiguration extends GuildsConfiguration>(): Promise<CustomGuildsConfiguration> => {
		const chosenEnvironment = process.argv.find((arg) => arg.startsWith("--config"))?.split("=")[1];
		if (!chosenEnvironment) {
			throw new Error("Environment not provided");
		}

		const srcPath = path.dirname(path.resolve(process.argv[1]));
		const filePath = path.join(srcPath, "..", "stellia.json");
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, async (err, data) => {
				if (err) {
                    return reject(new Error("stellia.json file not found"));
				}

                const environments = JSON.parse(data.toString()).environments;
                if (!Object.keys(environments).includes(chosenEnvironment)) {
                    return reject(new Error("Invalid environment"));
                }

                const environmentData = environments[chosenEnvironment];
                const environmentPath = environmentData.production
                    ? StelliaClient.convertFilePathToProduction(environmentData.file)
                    : environmentData.file;

                const environmentAbsolutePath = pathToFileURL(path.join(srcPath, "..", environmentPath)).href;
                import(environmentAbsolutePath)
                    .then((environmentFile) => resolve(environmentFile.environment))
                    .catch(() => reject(new Error("Error parsing stellia.json file")));
            });
		});
	};

	public getGuildConfiguration = <CustomGuildConfiguration extends GuildConfiguration>(guildId: string): CustomGuildConfiguration | undefined => {
		return this.utils.getGuildConfiguration(guildId);
	};

	public handleInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
		await this.utils.handleInteraction(interaction);
	};

    private async initializeAsyncFields(stelliaOptions?: StelliaOptions): Promise<void> {
        this.utils = await StelliaUtils.create(this);
        await this.initializeManagers(stelliaOptions?.managers);
    };

    private async initializeManagers(managers: StelliaOptions["managers"] | undefined): Promise<void> {
        if (!managers) {
            return;
        }

        if (managers.autoCompletes?.directoryPath) {
            this.managers.autoCompletes = await AutoCompleteManager.create(this, managers.autoCompletes.directoryPath);
        }

        if (managers.buttons?.directoryPath) {
            this.managers.buttons = await ButtonManager.create(this, managers.buttons.directoryPath);
        }

        if (managers.commands?.directoryPath) {
            this.managers.commands = await CommandManager.create(this, managers.commands.directoryPath);
        }

        if (managers.contextMenus?.directoryPath) {
            this.managers.contextMenus = await ContextMenuManager.create(this, managers.contextMenus.directoryPath);
        }

        if (managers.events?.directoryPath) {
            this.managers.events = await EventManager.create(this, managers.events.directoryPath);
        }

        if (managers.selectMenus?.directoryPath) {
            this.managers.selectMenus = await SelectMenuManager.create(this, managers.selectMenus.directoryPath);
        }

        if (managers.modals?.directoryPath) {
            this.managers.modals = await ModalManager.create(this, managers.modals.directoryPath);
        }
    };

	private readonly areManagersLoaded = (): boolean => {
		const managers = Object.values(this.managers);
		return managers.length === 0
			? true
			: managers.every((manager: Manager) => manager.isManagerLoaded());
	};

	private static readonly convertFilePathToProduction = (filePath: string): string => {
		return filePath.replace("src", "dist").replace(".ts", ".js");
	};
}

interface StelliaOptions {
	managers?: {
		autoCompletes?: ManagerOptions;
		buttons?: ManagerOptions;
		commands?: ManagerOptions;
		contextMenus?: ManagerOptions;
		events?: ManagerOptions;
		selectMenus?: ManagerOptions;
		modals?: ManagerOptions;
	};
	environment?: ClientEnvironment;
}
