import { type StelliaClient } from "@client/index.js";
import {
    type AnySelectMenuInteraction,
    ApplicationCommandType,
    type AutocompleteInteraction,
    type ButtonInteraction,
    type ChatInputCommandInteraction,
    type ContextMenuCommandInteraction,
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
import { AnyInteraction, InteractionType } from "@typescript/index.js";

export class StelliaUtils {
    public readonly client: StelliaClient;
    private interactionHandlers: Map<InteractionType, (interaction: AnyInteraction) => Promise<void>>;

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
    }

    public initializeCommands = async (): Promise<void> => {
        const commands = [
            ...Array.from(this.client.commands.getAll<CommandStructure>().values()).map((command) => command.data),
            ...Array.from(this.client.contextMenus.getAll<ContextMenuStructure>().values()).map((contextMenu) => contextMenu.data),
        ];

        if (this.client.isReady()) {
            const rest = new REST({ version: DISCORD_API_VERSION }).setToken(this.client.token);
            try {
                await rest.put(Routes.applicationCommands(this.client.user.id), { body: commands })
            } catch (error) {
                console.error(error);
            }
        }
    }

    public handleInteraction = async (interaction: AnyInteraction): Promise<void> => {
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

    private handleAutoCompleteInteraction = async (interaction: AnyInteraction): Promise<void> => {
        try {
            const interactionAutoComplete = interaction as AutocompleteInteraction<"cached">;
            const autoComplete = this.client.autoCompletes.get<AutoCompleteStructure>(interactionAutoComplete.commandName);
            if (!autoComplete) return;

            await autoComplete.execute(this.client, interactionAutoComplete);
        } catch (error) {
            console.error(error);
        }
    }

    private handleButtonInteraction = async (interaction: AnyInteraction): Promise<void> => {
        try {
            const buttonInteraction = interaction as ButtonInteraction<"cached">;
            const button = this.client.buttons.get<ButtonStructure>(buttonInteraction.customId);
            if (!button) return;

            await button.execute(this.client, buttonInteraction);
        } catch (error) {
            console.error(error);
        }
    }

    private handleCommandInteraction = async (interaction: AnyInteraction): Promise<void> => {
        try {
            const interactionCommand = interaction as ChatInputCommandInteraction<"cached">;
            const command = this.client.commands.get<CommandStructure>(interactionCommand.commandName);
            if (!command) return;

            await command.execute(this.client, interactionCommand);
        } catch (error) {
            console.error(error);
        }
    }

    private handleContextMenuInteraction = async (interaction: AnyInteraction): Promise<void> => {
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

    private handleModalInteraction = async (interaction: AnyInteraction): Promise<void> => {
        try {
            const interactionModal = interaction as ModalSubmitInteraction<"cached">;
            const modal = this.client.modals.get<ModalStructure>(interactionModal.customId);
            if (!modal) return;

            await modal.execute(this.client, interactionModal);
        } catch (error) {
            console.error(error);
        }
    }

    private handleSelectMenuInteraction = async (interaction: AnyInteraction): Promise<void> => {
        try {
            const interactionSelectMenu = interaction as AnySelectMenuInteraction<"cached">;
            const selectMenu = this.client.modals.get<SelectMenuStructure>(interactionSelectMenu.customId);
            if (!selectMenu) return;

            await selectMenu.execute(this.client, interactionSelectMenu);
        } catch (error) {
            console.error(error);
        }
    }

    private handleMessageContextMenuInteraction = async (interaction: MessageContextMenuCommandInteraction<"cached">): Promise<void> => {
        try {
            const messageContextMenu = this.client.contextMenus.get<ContextMenuStructure>(interaction.commandName);
            if (!messageContextMenu) return;

            await messageContextMenu.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
        }
    }

    private handleUserContextMenuInteraction = async (interaction: UserContextMenuCommandInteraction<"cached">): Promise<void> => {
        try {
            const userContextMenu = this.client.contextMenus.get<ContextMenuStructure>(interaction.commandName);
            if (!userContextMenu) return;

            await userContextMenu.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
        }
    }

    private getInteractionType(interaction: AnyInteraction): InteractionType {
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