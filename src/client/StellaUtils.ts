import {StellaClient} from "@client/index.js";
import {
    AnySelectMenuInteraction,
    ApplicationCommandType,
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    REST,
    Routes,
    UserContextMenuCommandInteraction
} from "discord.js";
import { DISCORD_API_VERSION } from "@constants/index.js";
import type {
    AutoCompleteStructure,
    ButtonStructure,
    CommandStructure,
    ContextMenuStructure,
    ModalStructure,
    SelectMenuStructure
} from "@structures/index.js";

export class StellaUtils {
    public readonly client: StellaClient;

    constructor(client: StellaClient) {
        this.client = client;
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

    public handleAutoCompleteInteraction = async (interaction: AutocompleteInteraction<"cached">, interactionData: AutoCompleteStructure): Promise<void> => {
        try {
            await interactionData.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
        }
    }

    public handleButtonInteraction = async (interaction: ButtonInteraction<"cached">, interactionData: ButtonStructure): Promise<void> => {
        try {
            await interactionData.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
        }
    }

    public handleCommandInteraction = async (interaction: ChatInputCommandInteraction<"cached">, interactionData: CommandStructure): Promise<void> => {
        try {
            await interactionData.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
        }
    }

    public handleContextMenuInteraction = async (interaction: ContextMenuCommandInteraction<"cached">, interactionData: ContextMenuStructure): Promise<void> => {
        try {
            if (interaction.commandType === ApplicationCommandType.Message) {
                await this.handleMessageContextMenuInteraction(interaction as MessageContextMenuCommandInteraction<"cached">, interactionData);
            } else if (interaction.commandType === ApplicationCommandType.User) {
                await this.handleUserContextMenuInteraction(interaction as UserContextMenuCommandInteraction<"cached">, interactionData);
            }
        } catch (error) {
            console.error(error);
        }
    }

    public handleModalInteraction = async (interaction: ModalSubmitInteraction<"cached">, interactionData: ModalStructure): Promise<void> => {
        try {
            await interactionData.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
        }
    }

    public handleSelectMenuInteraction = async (interaction: AnySelectMenuInteraction<"cached">, interactionData: SelectMenuStructure): Promise<void> => {
        try {
            await interactionData.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
        }
    }

    private handleMessageContextMenuInteraction = async (interaction: MessageContextMenuCommandInteraction<"cached">, interactionData: ContextMenuStructure): Promise<void> => {
        try {
            await interactionData.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
        }
    }

    private handleUserContextMenuInteraction = async (interaction: UserContextMenuCommandInteraction<"cached">, interactionData: ContextMenuStructure): Promise<void> => {
        try {
            await interactionData.execute(this.client, interaction);
        } catch (error) {
            console.error(error);
        }
    }
}