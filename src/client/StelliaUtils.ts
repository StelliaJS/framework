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
    type ButtonStructure,
    type CommandStructure,
    type ContextMenuStructure,
    type ModalStructure,
    type SelectMenuStructure
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
        if (this.client.environment.isEnvironmentsEnabled) {
            this.client.getEnvironment()
                .then((environment) => {
                    this.environment = environment;
                    console.log("Environment loaded");
                })
                .catch((error) => console.error(error));
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
            } catch (error) {
                console.error(error);
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
            const interactionAutoComplete = interaction as AutocompleteInteraction<"cached">;
            const autoCompleteManager = this.client.managers.autoCompletes;
            if (!autoCompleteManager) return;

            const autoComplete = autoCompleteManager.getByCustomId<AutoCompleteStructure>(interactionAutoComplete.commandName);
            if (!autoComplete) return;

            if (this.client.environment.isEnvironmentsEnabled) {
                await autoComplete.execute(this.client, this.environment, interactionAutoComplete);
                return;
            }

            await autoComplete.execute(this.client, interactionAutoComplete);
        } catch (error) {
            console.error(error);
        }
    }

    private handleButtonInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        try {
            const buttonInteraction = interaction as ButtonInteraction<"cached">;
            const buttonManager = this.client.managers.buttons;
            if (!buttonManager) return;

            const button = buttonManager.getByCustomId<ButtonStructure>(buttonInteraction.customId) || buttonManager.getByRegex<ButtonStructure>(buttonInteraction.customId);
            if (!button) return;

            if (this.client.environment.isEnvironmentsEnabled) {
                await button.execute(this.client, this.environment, buttonInteraction);
                return;
            }

            await button.execute(this.client, buttonInteraction);
        } catch (error) {
            console.error(error);
        }
    }

    private handleCommandInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        try {
            const interactionCommand = interaction as ChatInputCommandInteraction<"cached">;
            const commandManager = this.client.managers.commands;
            if (!commandManager) return;

            const command = commandManager.getByCustomId<CommandStructure>(interactionCommand.commandName);
            if (!command) return;

            if (this.client.environment.isEnvironmentsEnabled) {
                await command.execute(this.client, this.environment, interactionCommand);
                return;
            }

            await command.execute(this.client, interactionCommand);
        } catch (error) {
            console.error(error);
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
            console.error(error);
        }
    }

    private handleModalInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        try {
            const interactionModal = interaction as ModalSubmitInteraction<"cached">;
            const modalManager = this.client.managers.modals;
            if (!modalManager) return;

            const modal = modalManager.getByCustomId<ModalStructure>(interactionModal.customId) || modalManager.getByRegex<ModalStructure>(interactionModal.customId);
            if (!modal) return;

            if (this.client.environment.isEnvironmentsEnabled) {
                await modal.execute(this.client, this.environment, interactionModal);
                return;
            }

            await modal.execute(this.client, interactionModal);
        } catch (error) {
            console.error(error);
        }
    }

    private handleSelectMenuInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
        try {
            const interactionSelectMenu = interaction as AnySelectMenuInteraction<"cached">;
            const selectMenuManager = this.client.managers.selectMenus;
            if (!selectMenuManager) return;

            const selectMenu = selectMenuManager.getByCustomId<SelectMenuStructure>(interactionSelectMenu.customId) || selectMenuManager.getByRegex<SelectMenuStructure>(interactionSelectMenu.customId);
            if (!selectMenu) return;

            if (this.client.environment.isEnvironmentsEnabled) {
                await selectMenu.execute(this.client, this.environment, interactionSelectMenu);
                return;
            }

            await selectMenu.execute(this.client, interactionSelectMenu);
        } catch (error) {
            console.error(error);
        }
    }

    private handleMessageContextMenuInteraction = async (interaction: MessageContextMenuCommandInteraction<"cached">): Promise<void> => {
        try {
            const contextMenuManager = this.client.managers.contextMenus;
            if (!contextMenuManager) return;

            const messageContextMenu = contextMenuManager.getByCustomId<ContextMenuStructure>(interaction.commandName);
            if (!messageContextMenu) return;

            if (this.client.environment.isEnvironmentsEnabled) {
                await messageContextMenu.execute(this.client, this.environment, interaction);
                return;
            }

            await messageContextMenu.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
        }
    }

    private handleUserContextMenuInteraction = async (interaction: UserContextMenuCommandInteraction<"cached">): Promise<void> => {
        try {
            const contextMenuManager = this.client.managers.contextMenus;
            if (!contextMenuManager) return;

            const userContextMenu = contextMenuManager.getByCustomId<ContextMenuStructure>(interaction.commandName);
            if (!userContextMenu) return;

            if (this.client.environment.isEnvironmentsEnabled) {
                await userContextMenu.execute(this.client, this.environment, interaction);
                return;
            }

            await userContextMenu.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
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