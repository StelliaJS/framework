import {
	type AnySelectMenuInteraction,
	type AutocompleteInteraction,
	type Awaitable,
	type ButtonInteraction,
	type ContextMenuCommandBuilder,
	type ChatInputCommandInteraction,
	type MessageContextMenuCommandInteraction,
	type ModalSubmitInteraction,
	type SlashCommandOptionsOnlyBuilder,
	type SlashCommandSubcommandsOnlyBuilder,
	type UserContextMenuCommandInteraction
} from "discord.js";
import { type EventStructure } from "structures/Event.js";
import { type StelliaClient } from "@client/index.js";
import { type GuildConfigurationType, type StelliaLocale } from "@typescript/index.js";

export interface AutoCompleteStructureWithGuildConfiguration<TConfig extends GuildConfigurationType = GuildConfigurationType> extends Omit<
	MessageInteractionStructure,
	"data"
> {
	data: Omit<MessageDataStructure, "reply">;
	execute(
		client: StelliaClient<true>,
		guildConfiguration: TConfig,
		memberLocale: StelliaLocale,
		interaction: AutocompleteInteraction<"cached">
	): Awaitable<unknown>;
}
export interface AutoCompleteStructureWithoutGuildConfiguration extends Omit<MessageInteractionStructure, "data"> {
	data: Omit<MessageDataStructure, "reply">;
	execute(client: StelliaClient<true>, memberLocale: StelliaLocale, interaction: AutocompleteInteraction<"cached">): Awaitable<unknown>;
}
export type AutoCompleteStructure = AutoCompleteStructureWithGuildConfiguration<any> | AutoCompleteStructureWithoutGuildConfiguration;

export interface ButtonStructureWithGuildConfiguration<
	TConfig extends GuildConfigurationType = GuildConfigurationType
> extends MessageInteractionStructure {
	execute(
		client: StelliaClient<true>,
		guildConfiguration: TConfig,
		memberLocale: StelliaLocale,
		interaction: ButtonInteraction<"cached">
	): Awaitable<unknown>;
}
export interface ButtonStructureWithoutGuildConfiguration extends MessageInteractionStructure {
	execute(client: StelliaClient<true>, memberLocale: StelliaLocale, interaction: ButtonInteraction<"cached">): Awaitable<unknown>;
}
export type ButtonStructure = ButtonStructureWithGuildConfiguration<any> | ButtonStructureWithoutGuildConfiguration;

export interface CommandStructureWithGuildConfiguration<
	TConfig extends GuildConfigurationType = GuildConfigurationType
> extends CommandInteractionStructure {
	execute(
		client: StelliaClient<true>,
		guildConfiguration: TConfig,
		memberLocale: StelliaLocale,
		interaction: ChatInputCommandInteraction<"cached">
	): Awaitable<unknown>;
}
export interface CommandStructureWithoutGuildConfiguration extends CommandInteractionStructure {
	execute(
		client: StelliaClient<true>,
		memberLocale: StelliaLocale,
		interaction: ChatInputCommandInteraction<"cached">
	): Awaitable<unknown>;
}
export type CommandStructure = CommandStructureWithGuildConfiguration<any> | CommandStructureWithoutGuildConfiguration;

export interface ContextMenuStructureWithGuildConfiguration<
	TConfig extends GuildConfigurationType = GuildConfigurationType
> extends ContextMenuInteractionStructure {
	execute(
		client: StelliaClient<true>,
		guildConfiguration: TConfig,
		memberLocale: StelliaLocale,
		interaction: MessageContextMenuCommandInteraction<"cached"> | UserContextMenuCommandInteraction<"cached">
	): Awaitable<unknown>;
}
export interface ContextMenuStructureWithoutGuildConfiguration extends ContextMenuInteractionStructure {
	execute(
		client: StelliaClient<true>,
		memberLocale: StelliaLocale,
		interaction: MessageContextMenuCommandInteraction<"cached"> | UserContextMenuCommandInteraction<"cached">
	): Awaitable<unknown>;
}
export type ContextMenuStructure = ContextMenuStructureWithGuildConfiguration<any> | ContextMenuStructureWithoutGuildConfiguration;

export interface ModalStructureWithGuildConfiguration<
	TConfig extends GuildConfigurationType = GuildConfigurationType
> extends MessageInteractionStructure {
	execute(
		client: StelliaClient<true>,
		guildConfiguration: TConfig,
		memberLocale: StelliaLocale,
		interaction: ModalSubmitInteraction<"cached">
	): Awaitable<unknown>;
}
export interface ModalStructureWithoutGuildConfiguration extends MessageInteractionStructure {
	execute(client: StelliaClient<true>, memberLocale: StelliaLocale, interaction: ModalSubmitInteraction<"cached">): Awaitable<unknown>;
}
export type ModalStructure = ModalStructureWithGuildConfiguration<any> | ModalStructureWithoutGuildConfiguration;

export interface SelectMenuStructureWithGuildConfiguration<
	TConfig extends GuildConfigurationType = GuildConfigurationType
> extends MessageInteractionStructure {
	execute(
		client: StelliaClient<true>,
		guildConfiguration: TConfig,
		memberLocale: StelliaLocale,
		interaction: AnySelectMenuInteraction<"cached">
	): Awaitable<unknown>;
}
export interface SelectMenuStructureWithoutGuildConfiguration extends MessageInteractionStructure {
	execute(client: StelliaClient<true>, memberLocale: StelliaLocale, interaction: AnySelectMenuInteraction<"cached">): Awaitable<unknown>;
}
export type SelectMenuStructure = SelectMenuStructureWithGuildConfiguration<any> | SelectMenuStructureWithoutGuildConfiguration;

export type AnyInteractionStructure =
	| AutoCompleteStructure
	| ButtonStructure
	| CommandStructure
	| ContextMenuStructure
	| EventStructure
	| ModalStructure
	| SelectMenuStructure;

interface CommandInteractionStructure {
	data: CommandDataStructure;
}
interface CommandDataStructure {
	command: SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
	reply: ReplyStructure<true> | ReplyStructure<false>;
}

interface ContextMenuInteractionStructure {
	data: ContextMenuDataStructure;
}
interface ContextMenuDataStructure {
	command: ContextMenuCommandBuilder;
	reply: ReplyStructure<true> | ReplyStructure<false>;
}

interface MessageInteractionStructure {
	data: MessageDataStructure;
}
interface MessageDataStructure {
	name: string | RegExp;
	once: boolean;
	reply: ReplyStructure<true> | ReplyStructure<false>;
}

type ReplyStructure<T extends boolean = false> = T extends true ? { autoDefer: true; ephemeral: boolean } : { autoDefer: false };

export function defineAutoComplete(event: AutoCompleteStructureWithoutGuildConfiguration): AutoCompleteStructureWithoutGuildConfiguration {
	return event;
}
export function createGuildAutoCompleteFactory<TConfig extends GuildConfigurationType = GuildConfigurationType>() {
	return function (event: AutoCompleteStructureWithGuildConfiguration<TConfig>): AutoCompleteStructureWithGuildConfiguration<TConfig> {
		return event;
	};
}

export function defineButton(event: ButtonStructureWithoutGuildConfiguration): ButtonStructureWithoutGuildConfiguration {
	return event;
}
export function createGuildButtonFactory<TConfig extends GuildConfigurationType = GuildConfigurationType>() {
	return function (event: ButtonStructureWithGuildConfiguration<TConfig>): ButtonStructureWithGuildConfiguration<TConfig> {
		return event;
	};
}

export function defineCommand(event: CommandStructureWithoutGuildConfiguration): CommandStructureWithoutGuildConfiguration {
	return event;
}
export function createGuildCommandFactory<TConfig extends GuildConfigurationType = GuildConfigurationType>() {
	return function (event: CommandStructureWithGuildConfiguration<TConfig>): CommandStructureWithGuildConfiguration<TConfig> {
		return event;
	};
}

export function defineContextMenu(event: ContextMenuStructureWithoutGuildConfiguration): ContextMenuStructureWithoutGuildConfiguration {
	return event;
}
export function createGuildContextMenuFactory<TConfig extends GuildConfigurationType = GuildConfigurationType>() {
	return function (event: ContextMenuStructureWithGuildConfiguration<TConfig>): ContextMenuStructureWithGuildConfiguration<TConfig> {
		return event;
	};
}

export function defineModal(event: ModalStructureWithoutGuildConfiguration): ModalStructureWithoutGuildConfiguration {
	return event;
}
export function createGuildModalFactory<TConfig extends GuildConfigurationType = GuildConfigurationType>() {
	return function (event: ModalStructureWithGuildConfiguration<TConfig>): ModalStructureWithGuildConfiguration<TConfig> {
		return event;
	};
}

export function defineSelectMenu(event: SelectMenuStructureWithoutGuildConfiguration): SelectMenuStructureWithoutGuildConfiguration {
	return event;
}
export function createGuildSelectMenuFactory<TConfig extends GuildConfigurationType = GuildConfigurationType>() {
	return function (event: SelectMenuStructureWithGuildConfiguration<TConfig>): SelectMenuStructureWithGuildConfiguration<TConfig> {
		return event;
	};
}
