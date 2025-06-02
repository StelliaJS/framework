import { type StelliaClient } from "@client/index.js";
import {
    type AnySelectMenuInteraction,
    ApplicationCommandType,
    type AutocompleteInteraction,
    type ButtonInteraction,
    type ChatInputCommandInteraction,
    type ContextMenuCommandInteraction,
    type Interaction,
    type MessageContextMenuCommandInteraction,
    type ModalSubmitInteraction,
    REST,
    Routes,
    type UserContextMenuCommandInteraction
} from "discord.js";
import { DISCORD_API_VERSION } from "@constants/index.js";
import {
    type AutoCompleteStructure,
    type AutoCompleteStructureWithEnvironment,
    type AutoCompleteStructureWithoutEnvironment,
    type ButtonStructure,
    type ButtonStructureWithEnvironment,
    type ButtonStructureWithoutEnvironment,
    type CommandStructure,
    type CommandStructureWithEnvironment,
    type CommandStructureWithoutEnvironment,
    type ContextMenuStructure,
    type ContextMenuStructureWithEnvironment,
    type ContextMenuStructureWithoutEnvironment,
    type ModalStructure,
    type ModalStructureWithEnvironment,
    type ModalStructureWithoutEnvironment,
    type SelectMenuStructure,
    type SelectMenuStructureWithEnvironment,
    type SelectMenuStructureWithoutEnvironment
} from "@structures/index.js";
import { type EnvironmentConfiguration, InteractionType } from "@typescript/index.js";

export class StelliaUtils {
    public readonly client: StelliaClient;
    private readonly interactionHandlers: Map<InteractionType, (interaction: Interaction<"cached">) => Promise<void>>;
    private environment: EnvironmentConfiguration;

    constructor(client: StelliaClient) {
        this.client = client;
        this.interactionHandlers = new Map([
            [InteractionType.Autocomplete, this.handleAutoCompleteInteraction],
            [InteractionType.Button, this.handleButtonInteraction],
            [InteractionType.ChatInputCommand, this.handleCommandInteraction],
            [InteractionType.ContextMenuCommand, this.handleContextMenuInteraction],
            [InteractionType.ModalSubmit, this.handleModalInteraction],
            [InteractionType.SelectMenu, this.handleSelectMenuInteraction]
        ]);
        if (this.client.environment.areEnvironmentsEnabled) {
            this.client.getEnvironment()
                .then((environment) => {
                    this.environment = environment;
                    console.log("Environment loaded");
                    logger.success("Guilds configuration loaded successfully");
                })
                .catch((error) => logger.error(`Error while loading guilds configuration: ${error}`));
        }
    }

    public initializeCommands = async (): Promise<void> => {
        const commands = this.client.managers.commands?.getAll<CommandStructure>().values();
        const contextMenus = this.client.managers.contextMenus?.getAll<ContextMenuStructure>().values();
        const applicationCommands = [...(commands || []), ...(contextMenus || [])].map((item) => item.data);

        if (this.client.isReady()) {
            const rest = new REST({ version: DISCORD_API_VERSION }).setToken(this.client.token);
            try {
                await rest.put(Routes.applicationCommands(this.client.user.id), { body: applicationCommands })
                await rest.put(Routes.applicationCommands(this.client.user.id), { body: applicationCommands });
            } catch (error) {
                logger.error(`Error while registering application commands: ${error}`);
            }
        }
    }

    public handleInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        if (interaction.inCachedGuild()) {
            const interactionType = this.getInteractionType(interaction);
            if (interactionType === InteractionType.Unknown) {
                throw new Error("Unknown interaction type");
            }

            const handler = this.interactionHandlers.get(interactionType);
            if (handler) {
                await handler(interaction);
            }
        }
    }

    private handleAutoCompleteInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        try {
            const autoCompleteInteraction = interaction as AutocompleteInteraction<"cached">;
            const autoCompleteManager = this.client.managers.autoCompletes;
            if (!autoCompleteManager) return;

            const autoComplete = autoCompleteManager.getByCustomId<AutoCompleteStructure>(autoCompleteInteraction.commandName);
            if (!autoComplete) return;

            if (this.client.environment.areEnvironmentsEnabled) {
                const autoCompleteWithEnv = autoComplete as AutoCompleteStructureWithEnvironment;
                await autoCompleteWithEnv.execute(this.client, this.environment, autoCompleteInteraction);
            } else {
                const autoCompleteWithoutEnv = autoComplete as AutoCompleteStructureWithoutEnvironment;
                await autoCompleteWithoutEnv.execute(this.client, autoCompleteInteraction);
            }
        } catch (error) {
            logger.error(`Error while handling autocomplete interaction: ${error}`);
        }
    }

    private handleButtonInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        try {
            const buttonInteraction = interaction as ButtonInteraction<"cached">;
            const buttonManager = this.client.managers.buttons;
            if (!buttonManager) return;

            const button = buttonManager.getByCustomId<ButtonStructure>(buttonInteraction.customId) || buttonManager.getByRegex<ButtonStructure>(buttonInteraction.customId);
            if (!button) return;

            if (this.client.environment.areEnvironmentsEnabled) {
                const buttonWithEnv = button as ButtonStructureWithEnvironment;
                await buttonWithEnv.execute(this.client, this.environment, buttonInteraction);
            } else {
                const buttonWithoutEnv = button as ButtonStructureWithoutEnvironment;
                await buttonWithoutEnv.execute(this.client, buttonInteraction);
            }
        } catch (error) {
            logger.error(`Error while handling button interaction: ${error}`);
        }
    }

    private handleCommandInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        try {
            const commandInteraction = interaction as ChatInputCommandInteraction<"cached">;
            const commandManager = this.client.managers.commands;
            if (!commandManager) return;

            let command = commandManager.getByCustomId<CommandStructure>(commandInteraction.commandName);
            if (!command) return;

            if (this.client.environment.areEnvironmentsEnabled) {
                const commandWithEnv = command as CommandStructureWithEnvironment;
                await commandWithEnv.execute(this.client, this.environment, commandInteraction);
            } else {
                const commandWithoutEnv = command as CommandStructureWithoutEnvironment;
                await commandWithoutEnv.execute(this.client, commandInteraction);
            }
        } catch (error) {
            logger.error(`Error while handling command interaction: ${error}`);
        }
    }

    private handleContextMenuInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        try {
            const interactionContextMenu = interaction as ContextMenuCommandInteraction<"cached">;
            if (interactionContextMenu.commandType === ApplicationCommandType.Message) {
                const messageInteraction = interaction as MessageContextMenuCommandInteraction<"cached">;
                await this.handleMessageContextMenuInteraction(messageInteraction);
            } else if (interactionContextMenu.commandType === ApplicationCommandType.User) {
                const userInteraction = interaction as UserContextMenuCommandInteraction<"cached">;
                await this.handleUserContextMenuInteraction(userInteraction);
            }
        } catch (error) {
            logger.error(`Error while handling context menu interaction: ${error}`);
        }
    }

    private handleModalInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        try {
            const modalInteraction = interaction as ModalSubmitInteraction<"cached">;
            const modalManager = this.client.managers.modals;
            if (!modalManager) return;

            const modal = modalManager.getByCustomId<ModalStructure>(modalInteraction.customId) || modalManager.getByRegex<ModalStructure>(modalInteraction.customId);
            if (!modal) return;

            if (this.client.environment.areEnvironmentsEnabled) {
                const modalWithEnv = modal as ModalStructureWithEnvironment;
                await modalWithEnv.execute(this.client, this.environment, modalInteraction);
            } else {
                const modalWithoutEnv = modal as ModalStructureWithoutEnvironment;
                await modalWithoutEnv.execute(this.client, modalInteraction);
            }
        } catch (error) {
            logger.error(`Error while handling modal interaction: ${error}`);
        }
    }

    private handleSelectMenuInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        try {
            const selectMenuInteraction = interaction as AnySelectMenuInteraction<"cached">;
            const selectMenuManager = this.client.managers.selectMenus;
            if (!selectMenuManager) return;

            const selectMenu = selectMenuManager.getByCustomId<SelectMenuStructure>(selectMenuInteraction.customId) || selectMenuManager.getByRegex<SelectMenuStructure>(selectMenuInteraction.customId);
            if (!selectMenu) return;

            if (this.client.environment.areEnvironmentsEnabled) {
                const selectMenuWithEnv = selectMenu as SelectMenuStructureWithEnvironment;
                await selectMenuWithEnv.execute(this.client, this.environment, selectMenuInteraction);
            } else {
                const modalWithoutEnv = selectMenu as SelectMenuStructureWithoutEnvironment;
                await modalWithoutEnv.execute(this.client, selectMenuInteraction);
            }
        } catch (error) {
            logger.error(`Error while handling select menu interaction: ${error}`);
        }
    }

    private handleMessageContextMenuInteraction = async (interaction: MessageContextMenuCommandInteraction<"cached">): Promise<void> => {
        try {
            const contextMenuManager = this.client.managers.contextMenus;
            if (!contextMenuManager) return;

            const messageContextMenu = contextMenuManager.getByCustomId<ContextMenuStructure>(interaction.commandName);
            if (!messageContextMenu) return;

            if (this.client.environment.areEnvironmentsEnabled) {
                const messageContextMenuWithEnv = messageContextMenu as ContextMenuStructureWithEnvironment;
                await messageContextMenuWithEnv.execute(this.client, this.environment, interaction);
            } else {
                const messageContextMenuWithoutEnv = messageContextMenu as ContextMenuStructureWithoutEnvironment;
                await messageContextMenuWithoutEnv.execute(this.client, interaction);
            }
        } catch (error) {
            logger.error(`Error while handling message context menu interaction: ${error}`);
        }
    }

    private handleUserContextMenuInteraction = async (interaction: UserContextMenuCommandInteraction<"cached">): Promise<void> => {
        try {
            const contextMenuManager = this.client.managers.contextMenus;
            if (!contextMenuManager) return;

            const userContextMenu = contextMenuManager.getByCustomId<ContextMenuStructure>(interaction.commandName);
            if (!userContextMenu) return;

            if (this.client.environment.areEnvironmentsEnabled) {
                const userContextMenuWithEnv = userContextMenu as ContextMenuStructureWithEnvironment;
                await userContextMenuWithEnv.execute(this.client, this.environment, interaction);
            } else {
                const userContextMenuWithoutEnv = userContextMenu as ContextMenuStructureWithoutEnvironment;
                await userContextMenuWithoutEnv.execute(this.client, interaction);
            }
        } catch (error) {
            logger.error(`Error while handling user context menu interaction: ${error}`);
        }
    }

    private getInteractionType(interaction: Interaction<"cached">): InteractionType {
        if (interaction.isAutocomplete()) {
            return InteractionType.Autocomplete;
        }
        if (interaction.isButton()) {
            return InteractionType.Button;
        }
        if (interaction.isChatInputCommand()) {
            return InteractionType.ChatInputCommand;
        }
        if (interaction.isContextMenuCommand()) {
            return InteractionType.ContextMenuCommand;
        }
        if (interaction.isModalSubmit()) {
            return InteractionType.ModalSubmit;
        }
        if (interaction.isAnySelectMenu()) {
            return InteractionType.SelectMenu;
        }

        return InteractionType.Unknown;
    }
}