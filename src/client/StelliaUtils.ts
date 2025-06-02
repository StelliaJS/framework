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
    type AutoCompleteStructureWithGuildConfiguration,
    type AutoCompleteStructureWithoutGuildConfiguration,
    type ButtonStructure,
    type ButtonStructureWithGuildConfiguration,
    type ButtonStructureWithoutGuildConfiguration,
    type CommandStructure,
    type CommandStructureWithGuildConfiguration,
    type CommandStructureWithoutGuildConfiguration,
    type ContextMenuStructure,
    type ContextMenuStructureWithGuildConfiguration,
    type ContextMenuStructureWithoutGuildConfiguration,
    type ModalStructure,
    type ModalStructureWithGuildConfiguration,
    type ModalStructureWithoutGuildConfiguration,
    type SelectMenuStructure,
    type SelectMenuStructureWithGuildConfiguration,
    type SelectMenuStructureWithoutGuildConfiguration
} from "@structures/index.js";
import { type GuildConfiguration, type GuildsConfiguration, InteractionType } from "@typescript/index.js";
import { logger } from "@utils/logger.js";

export class StelliaUtils {
    public readonly client: StelliaClient;
    private readonly interactionHandlers: Map<InteractionType, (interaction: Interaction<"cached">) => Promise<void>>;
    private guildsConfiguration: GuildsConfiguration;

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
        if (this.client.environment.areGuildsConfigurationEnabled) {
            this.client.getGuildsConfiguration()
                .then((guildsConfiguration) => {
                    this.guildsConfiguration = guildsConfiguration;
                    logger.success("Guilds configuration loaded successfully for interactions");
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
                await rest.put(Routes.applicationCommands(this.client.user.id), { body: applicationCommands });
                logger.success("Application commands registered successfully");
            } catch (error) {
                logger.error(`Error while registering application commands: ${error}`);
            }
        }
    }

    public getGuildConfiguration = (guildId: string): GuildConfiguration | undefined => {
        if (!this.client.environment.areGuildsConfigurationEnabled || !this.guildsConfiguration) {
            return undefined;
        }

        const { guilds, ...general } = this.guildsConfiguration;
        const guildConfiguration = guilds[guildId];

        return { general, guild: guildConfiguration };
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

            if (this.client.environment.areGuildsConfigurationEnabled) {
                const autoCompleteWithGuildConfiguration = autoComplete as AutoCompleteStructureWithGuildConfiguration;
                const guildConfiguration = this.getGuildConfiguration(autoCompleteInteraction.guildId);
                await autoCompleteWithGuildConfiguration.execute(this.client, guildConfiguration, autoCompleteInteraction);
            } else {
                const autoCompleteWithoutGuildConfiguration = autoComplete as AutoCompleteStructureWithoutGuildConfiguration;
                await autoCompleteWithoutGuildConfiguration.execute(this.client, autoCompleteInteraction);
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

            if (this.client.environment.areGuildsConfigurationEnabled) {
                const buttonWithGuildConfiguration = button as ButtonStructureWithGuildConfiguration;
                const guildConfiguration = this.getGuildConfiguration(buttonInteraction.guildId);
                await buttonWithGuildConfiguration.execute(this.client, guildConfiguration, buttonInteraction);
            } else {
                const buttonWithoutGuildConfiguration = button as ButtonStructureWithoutGuildConfiguration;
                await buttonWithoutGuildConfiguration.execute(this.client, buttonInteraction);
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

            if (this.client.environment.areGuildsConfigurationEnabled) {
                const commandWithGuildConfiguration = command as CommandStructureWithGuildConfiguration;
                const guildConfiguration = this.getGuildConfiguration(commandInteraction.guildId);
                await commandWithGuildConfiguration.execute(this.client, guildConfiguration, commandInteraction);
            } else {
                const commandWithoutGuildConfiguration = command as CommandStructureWithoutGuildConfiguration;
                await commandWithoutGuildConfiguration.execute(this.client, commandInteraction);
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

            if (this.client.environment.areGuildsConfigurationEnabled) {
                const modalWithGuildConfiguration = modal as ModalStructureWithGuildConfiguration;
                const guildConfiguration = this.getGuildConfiguration(modalInteraction.guildId);
                await modalWithGuildConfiguration.execute(this.client, guildConfiguration, modalInteraction);
            } else {
                const modalWithoutGuildConfiguration = modal as ModalStructureWithoutGuildConfiguration;
                await modalWithoutGuildConfiguration.execute(this.client, modalInteraction);
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

            if (this.client.environment.areGuildsConfigurationEnabled) {
                const selectMenuWithGuildConfiguration = selectMenu as SelectMenuStructureWithGuildConfiguration;
                const guildConfiguration = this.getGuildConfiguration(selectMenuInteraction.guildId);
                await selectMenuWithGuildConfiguration.execute(this.client, guildConfiguration, selectMenuInteraction);
            } else {
                const modalWithoutGuildConfiguration = selectMenu as SelectMenuStructureWithoutGuildConfiguration;
                await modalWithoutGuildConfiguration.execute(this.client, selectMenuInteraction);
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

            if (this.client.environment.areGuildsConfigurationEnabled) {
                const messageContextMenuWithGuildConfiguration = messageContextMenu as ContextMenuStructureWithGuildConfiguration;
                const guildConfiguration = this.getGuildConfiguration(interaction.guildId);
                await messageContextMenuWithGuildConfiguration.execute(this.client, guildConfiguration, interaction);
            } else {
                const messageContextMenuWithoutGuildConfiguration = messageContextMenu as ContextMenuStructureWithoutGuildConfiguration;
                await messageContextMenuWithoutGuildConfiguration.execute(this.client, interaction);
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

            if (this.client.environment.areGuildsConfigurationEnabled) {
                const userContextMenuWithGuildConfiguration = userContextMenu as ContextMenuStructureWithGuildConfiguration;
                const guildConfiguration = this.getGuildConfiguration(interaction.guildId);
                await userContextMenuWithGuildConfiguration.execute(this.client, guildConfiguration, interaction);
            } else {
                const userContextMenuWithoutGuildConfiguration = userContextMenu as ContextMenuStructureWithoutGuildConfiguration;
                await userContextMenuWithoutGuildConfiguration.execute(this.client, interaction);
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