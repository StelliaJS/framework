import {
	type AnySelectMenuInteraction,
	ApplicationCommandType,
	type AutocompleteInteraction,
	type ButtonInteraction,
	type ChatInputCommandInteraction,
	type ContextMenuCommandInteraction,
	type Interaction,
	type Locale,
	type MessageContextMenuCommandInteraction,
	MessageFlags,
	type ModalSubmitInteraction,
	REST,
	Routes,
	type UserContextMenuCommandInteraction
} from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { DISCORD_API_VERSION } from "@constants/index.js";
import {
	type AutoCompleteStructureWithGuildConfiguration,
	type AutoCompleteStructureWithoutGuildConfiguration,
	type ButtonStructureWithGuildConfiguration,
	type ButtonStructureWithoutGuildConfiguration,
	type CommandStructureWithGuildConfiguration,
	type CommandStructureWithoutGuildConfiguration,
	type ContextMenuStructureWithGuildConfiguration,
	type ContextMenuStructureWithoutGuildConfiguration,
	type ModalStructureWithGuildConfiguration,
	type ModalStructureWithoutGuildConfiguration,
	type SelectMenuStructureWithGuildConfiguration,
	type SelectMenuStructureWithoutGuildConfiguration
} from "@structures/index.js";
import {
	type GuildConfiguration, type GuildsConfiguration, InteractionType, type StelliaLocale
} from "@typescript/index.js";
import { logger } from "@utils/logger.js";

export class StelliaUtils {
	public readonly client: StelliaClient;
	private readonly interactionHandlers: Map<InteractionType, (interaction: Interaction<"cached">) => Promise<void>>;
	private guildsConfiguration: GuildsConfiguration;

	private constructor(client: StelliaClient) {
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

	public static async create(client: StelliaClient): Promise<StelliaUtils> {
		const utils = new StelliaUtils(client);
		await utils.initializeGuildsConfiguration();

		return utils;
	}

	public initializeCommands = async (): Promise<void> => {
		const commands = this.client.managers.commands?.getAll().values();
		const contextMenus = this.client.managers.contextMenus?.getAll().values();
		const applicationCommands = [...(commands || []), ...(contextMenus || [])].map((item) => item.data.command);

		if (this.client.isReady()) {
			const rest = new REST({ version: DISCORD_API_VERSION }).setToken(this.client.token);
			try {
				await rest.put(Routes.applicationCommands(this.client.user.id), {
					body: applicationCommands
				});
				logger.success("Application commands registered successfully");
			} catch (error: unknown) {
				logger.errorWithInformation("Error while registering application commands", error);
			}
		}
	};

	public getGuildConfiguration = <CustomGuildConfiguration extends GuildConfiguration>(guildId: string): CustomGuildConfiguration | null => {
		if (!this.client.environment?.areGuildsConfigurationEnabled || !this.guildsConfiguration) {
			return null;
		}

		const { guilds, general } = this.guildsConfiguration;
		const guildConfiguration = guilds[guildId];

		return {
			general: general,
			guild: guildConfiguration
		} as CustomGuildConfiguration;
	};

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
	};

	private async initializeGuildsConfiguration(): Promise<void> {
		if (this.client.environment?.areGuildsConfigurationEnabled) {
			try {
				this.guildsConfiguration = await this.client.getGuildsConfiguration();
				logger.success("Guilds configuration loaded successfully for interactions");
			} catch (error: unknown) {
				logger.errorWithInformation("Error while loading guilds configuration", error);
			}
		}
	}

	private readonly handleAutoCompleteInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
		try {
			const autoCompleteInteraction = interaction as AutocompleteInteraction<"cached">;
			const autoCompleteManager = this.client.managers.autoCompletes;
			if (!autoCompleteManager) {
				return;
			}

			const autoComplete = autoCompleteManager.getByCustomId(autoCompleteInteraction.commandName);
			if (!autoComplete) {
				return;
			}

			const memberLocale = this.convertDiscordLocaleToStelliaLocale(autoCompleteInteraction.locale);
			if (this.client.environment?.areGuildsConfigurationEnabled) {
				const autoCompleteWithGuildConfiguration = autoComplete as AutoCompleteStructureWithGuildConfiguration;
				const guildConfiguration = this.getGuildConfiguration(autoCompleteInteraction.guildId);
				await autoCompleteWithGuildConfiguration.execute(this.client, guildConfiguration, memberLocale, autoCompleteInteraction);
			} else {
				const autoCompleteWithoutGuildConfiguration = autoComplete as AutoCompleteStructureWithoutGuildConfiguration;
				await autoCompleteWithoutGuildConfiguration.execute(this.client, memberLocale, autoCompleteInteraction);
			}
		} catch (error: unknown) {
			logger.errorWithInformation("Error while handling autocomplete interaction", error);
		}
	};

	private readonly handleButtonInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
		try {
			const buttonInteraction = interaction as ButtonInteraction<"cached">;
			const buttonManager = this.client.managers.buttons;
			if (!buttonManager) {
				return;
			}

			const button = buttonManager.getByCustomId(buttonInteraction.customId) || buttonManager.getByRegex(buttonInteraction.customId);
			if (!button) {
				return;
			}

			if (button.data.reply.autoDefer && !buttonInteraction.deferred) {
				await buttonInteraction.deferReply({ flags: button.data.reply.ephemeral ? MessageFlags.Ephemeral : undefined });
			}

			const memberLocale = this.convertDiscordLocaleToStelliaLocale(buttonInteraction.locale);
			if (this.client.environment?.areGuildsConfigurationEnabled) {
				const buttonWithGuildConfiguration = button as ButtonStructureWithGuildConfiguration;
				const guildConfiguration = this.getGuildConfiguration(buttonInteraction.guildId);
				await buttonWithGuildConfiguration.execute(this.client, guildConfiguration, memberLocale, buttonInteraction);
			} else {
				const buttonWithoutGuildConfiguration = button as ButtonStructureWithoutGuildConfiguration;
				await buttonWithoutGuildConfiguration.execute(this.client, memberLocale, buttonInteraction);
			}
		} catch (error: unknown) {
			logger.errorWithInformation("Error while handling button interaction", error);
		}
	};

	private readonly handleCommandInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
		try {
			const commandInteraction = interaction as ChatInputCommandInteraction<"cached">;
			const commandManager = this.client.managers.commands;
			if (!commandManager) {
				return;
			}

			const command = commandManager.getByCustomId(commandInteraction.commandName);
			if (!command) {
				return;
			}

			if (command.data.reply.autoDefer && !commandInteraction.deferred) {
				await commandInteraction.deferReply({ flags: command.data.reply.ephemeral ? MessageFlags.Ephemeral : undefined });
			}

			const memberLocale = this.convertDiscordLocaleToStelliaLocale(commandInteraction.locale);
			if (this.client.environment?.areGuildsConfigurationEnabled) {
				const commandWithGuildConfiguration = command as CommandStructureWithGuildConfiguration;
				const guildConfiguration = this.getGuildConfiguration(commandInteraction.guildId);
				await commandWithGuildConfiguration.execute(this.client, guildConfiguration, memberLocale, commandInteraction);
			} else {
				const commandWithoutGuildConfiguration = command as CommandStructureWithoutGuildConfiguration;
				await commandWithoutGuildConfiguration.execute(this.client, memberLocale, commandInteraction);
			}
		} catch (error: unknown) {
			logger.errorWithInformation("Error while handling command interaction", error);
		}
	};

	private readonly handleContextMenuInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
		try {
			const interactionContextMenu = interaction as ContextMenuCommandInteraction<"cached">;
			if (interactionContextMenu.commandType === ApplicationCommandType.Message) {
				const messageInteraction = interaction as MessageContextMenuCommandInteraction<"cached">;
				await this.handleMessageContextMenuInteraction(messageInteraction);
			} else if (interactionContextMenu.commandType === ApplicationCommandType.User) {
				const userInteraction = interaction as UserContextMenuCommandInteraction<"cached">;
				await this.handleUserContextMenuInteraction(userInteraction);
			}
		} catch (error: unknown) {
			logger.errorWithInformation("Error while handling context menu interaction", error);
		}
	};

	private readonly handleModalInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
		try {
			const modalInteraction = interaction as ModalSubmitInteraction<"cached">;
			const modalManager = this.client.managers.modals;
			if (!modalManager) {
				return;
			}

			const modal = modalManager.getByCustomId(modalInteraction.customId) || modalManager.getByRegex(modalInteraction.customId);
			if (!modal) {
				return;
			}

			if (modal.data.reply.autoDefer && !modalInteraction.deferred) {
				await modalInteraction.deferReply({ flags: modal.data.reply.ephemeral ? MessageFlags.Ephemeral : undefined });
			}

			const memberLocale = this.convertDiscordLocaleToStelliaLocale(modalInteraction.locale);
			if (this.client.environment?.areGuildsConfigurationEnabled) {
				const modalWithGuildConfiguration = modal as ModalStructureWithGuildConfiguration;
				const guildConfiguration = this.getGuildConfiguration(modalInteraction.guildId);
				await modalWithGuildConfiguration.execute(this.client, guildConfiguration, memberLocale, modalInteraction);
			} else {
				const modalWithoutGuildConfiguration = modal as ModalStructureWithoutGuildConfiguration;
				await modalWithoutGuildConfiguration.execute(this.client, memberLocale, modalInteraction);
			}
		} catch (error: unknown) {
			logger.errorWithInformation("Error while handling modal interaction", error);
		}
	};

	private readonly handleSelectMenuInteraction = async (interaction: Interaction<"cached">): Promise<void> => {
		try {
			const selectMenuInteraction = interaction as AnySelectMenuInteraction<"cached">;
			const selectMenuManager = this.client.managers.selectMenus;
			if (!selectMenuManager) {
				return;
			}

			const selectMenu = selectMenuManager.getByCustomId(selectMenuInteraction.customId) || selectMenuManager.getByRegex(selectMenuInteraction.customId);
			if (!selectMenu) {
				return;
			}

			if (selectMenu.data.reply.autoDefer && !selectMenuInteraction.deferred) {
				await selectMenuInteraction.deferReply({ flags: selectMenu.data.reply.ephemeral ? MessageFlags.Ephemeral : undefined });
			}

			const memberLocale = this.convertDiscordLocaleToStelliaLocale(selectMenuInteraction.locale);
			if (this.client.environment?.areGuildsConfigurationEnabled) {
				const selectMenuWithGuildConfiguration = selectMenu as SelectMenuStructureWithGuildConfiguration;
				const guildConfiguration = this.getGuildConfiguration(selectMenuInteraction.guildId);
				await selectMenuWithGuildConfiguration.execute(this.client, guildConfiguration, memberLocale, selectMenuInteraction);
			} else {
				const modalWithoutGuildConfiguration = selectMenu as SelectMenuStructureWithoutGuildConfiguration;
				await modalWithoutGuildConfiguration.execute(this.client, memberLocale, selectMenuInteraction);
			}
		} catch (error: unknown) {
			logger.errorWithInformation("Error while handling select menu interaction", error);
		}
	};

	private readonly handleMessageContextMenuInteraction = async (interaction: MessageContextMenuCommandInteraction<"cached">): Promise<void> => {
		try {
			const contextMenuManager = this.client.managers.contextMenus;
			if (!contextMenuManager) {
				return;
			}

			const messageContextMenu = contextMenuManager.getByCustomId(interaction.commandName);
			if (!messageContextMenu) {
				return;
			}

			if (messageContextMenu.data.reply.autoDefer && !interaction.deferred) {
				await interaction.deferReply({ flags: messageContextMenu.data.reply.ephemeral ? MessageFlags.Ephemeral : undefined });
			}

			const memberLocale = this.convertDiscordLocaleToStelliaLocale(interaction.locale);
			if (this.client.environment?.areGuildsConfigurationEnabled) {
				const messageContextMenuWithGuildConfiguration = messageContextMenu as ContextMenuStructureWithGuildConfiguration;
				const guildConfiguration = this.getGuildConfiguration(interaction.guildId);
				await messageContextMenuWithGuildConfiguration.execute(this.client, guildConfiguration, memberLocale, interaction);
			} else {
				const messageContextMenuWithoutGuildConfiguration = messageContextMenu as ContextMenuStructureWithoutGuildConfiguration;
				await messageContextMenuWithoutGuildConfiguration.execute(this.client, memberLocale, interaction);
			}
		} catch (error: unknown) {
			logger.errorWithInformation("Error while handling message context menu interaction", error);
		}
	};

	private readonly handleUserContextMenuInteraction = async (interaction: UserContextMenuCommandInteraction<"cached">): Promise<void> => {
		try {
			const contextMenuManager = this.client.managers.contextMenus;
			if (!contextMenuManager) {
				return;
			}

			const userContextMenu = contextMenuManager.getByCustomId(interaction.commandName);
			if (!userContextMenu) {
				return;
			}

			if (userContextMenu.data.reply.autoDefer && !interaction.deferred) {
				await interaction.deferReply({ flags: userContextMenu.data.reply.ephemeral ? MessageFlags.Ephemeral : undefined });
			}

			const memberLocale = this.convertDiscordLocaleToStelliaLocale(interaction.locale);
			if (this.client.environment?.areGuildsConfigurationEnabled) {
				const userContextMenuWithGuildConfiguration = userContextMenu as ContextMenuStructureWithGuildConfiguration;
				const guildConfiguration = this.getGuildConfiguration(interaction.guildId);
				await userContextMenuWithGuildConfiguration.execute(this.client, guildConfiguration, memberLocale, interaction);
			} else {
				const userContextMenuWithoutGuildConfiguration = userContextMenu as ContextMenuStructureWithoutGuildConfiguration;
				await userContextMenuWithoutGuildConfiguration.execute(this.client, memberLocale, interaction);
			}
		} catch (error: unknown) {
			logger.errorWithInformation("Error while handling user context menu interaction", error);
		}
	};

	private convertDiscordLocaleToStelliaLocale(locale: Locale): StelliaLocale {
		return locale.split("-")[0] as StelliaLocale;
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
