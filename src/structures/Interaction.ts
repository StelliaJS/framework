import {
	type AnySelectMenuInteraction,
	type AutocompleteInteraction,
	type Awaitable,
	type ButtonInteraction,
	type ChatInputCommandInteraction,
	type ContextMenuCommandType,
	type MessageContextMenuCommandInteraction,
	type ModalSubmitInteraction,
	type SlashCommandOptionsOnlyBuilder,
	type SlashCommandSubcommandsOnlyBuilder,
	type UserContextMenuCommandInteraction
} from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { type EventStructure } from "@structures/Event.js";
import { type GuildConfigurationType } from "@typescript/index.js";

export interface AutoCompleteStructureWithGuildConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, guildConfiguration: GuildConfigurationType, interaction: AutocompleteInteraction<"cached">): Awaitable<unknown>;
}
export interface AutoCompleteStructureWithoutGuildConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: AutocompleteInteraction<"cached">): Awaitable<unknown>;
}
export type AutoCompleteStructure =
	| AutoCompleteStructureWithGuildConfiguration
	| AutoCompleteStructureWithoutGuildConfiguration;

export interface ButtonStructureWithGuildConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, guildConfiguration: GuildConfigurationType, interaction: ButtonInteraction<"cached">): Awaitable<unknown>;
}
export interface ButtonStructureWithoutGuildConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: ButtonInteraction<"cached">): Awaitable<unknown>;
}
export type ButtonStructure =
	| ButtonStructureWithGuildConfiguration
	| ButtonStructureWithoutGuildConfiguration;

export interface CommandStructureWithGuildConfiguration extends CommandInteractionStructure {
    execute(client: StelliaClient, guildConfiguration: GuildConfigurationType, interaction: ChatInputCommandInteraction<"cached">): Awaitable<unknown>;
}
export interface CommandStructureWithoutGuildConfiguration extends CommandInteractionStructure {
    execute(client: StelliaClient, interaction: ChatInputCommandInteraction<"cached">): Awaitable<unknown>;
}
export type CommandStructure =
	| CommandStructureWithGuildConfiguration
	| CommandStructureWithoutGuildConfiguration;

export interface ContextMenuStructureWithGuildConfiguration extends ContextMenuInteractionStructure {
    execute(client: StelliaClient, guildConfiguration: GuildConfigurationType, interaction: MessageContextMenuCommandInteraction<"cached"> | UserContextMenuCommandInteraction<"cached">): Awaitable<unknown>;
}
export interface ContextMenuStructureWithoutGuildConfiguration extends ContextMenuInteractionStructure {
    execute(client: StelliaClient, interaction: MessageContextMenuCommandInteraction<"cached"> | UserContextMenuCommandInteraction<"cached">): Awaitable<unknown>;
}
export type ContextMenuStructure =
	| ContextMenuStructureWithGuildConfiguration
	| ContextMenuStructureWithoutGuildConfiguration;

export interface ModalStructureWithGuildConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, guildConfiguration: GuildConfigurationType, interaction: ModalSubmitInteraction<"cached">): Awaitable<unknown>;
}
export interface ModalStructureWithoutGuildConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: ModalSubmitInteraction<"cached">): Awaitable<unknown>;
}
export type ModalStructure =
	| ModalStructureWithGuildConfiguration
	| ModalStructureWithoutGuildConfiguration;

export interface SelectMenuStructureWithGuildConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, guildConfiguration: GuildConfigurationType, interaction: AnySelectMenuInteraction<"cached">): Awaitable<unknown>;
}
export interface SelectMenuStructureWithoutGuildConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: AnySelectMenuInteraction<"cached">): Awaitable<unknown>;
}
export type SelectMenuStructure =
	| SelectMenuStructureWithGuildConfiguration
	| SelectMenuStructureWithoutGuildConfiguration;

export type AnyInteractionStructure =
	| AutoCompleteStructure
	| ButtonStructure
	| CommandStructure
	| ContextMenuStructure
	| EventStructure
	| ModalStructure
	| SelectMenuStructure;

interface CommandInteractionStructure {
	data: SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
}
interface ContextMenuInteractionStructure {
	data: ContextMenuDataStructure;
}
interface ContextMenuDataStructure {
	name: string;
	type: ContextMenuCommandType;
}

interface MessageInteractionStructure {
	data: MessageDataStructure;
}
interface MessageDataStructure {
	name: string | RegExp;
	once: boolean;
}
