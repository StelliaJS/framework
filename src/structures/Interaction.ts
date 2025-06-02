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
    type UserContextMenuCommandInteraction
} from "discord.js";
import { type StelliaClient } from "@client/index.js";
import { type GuildsConfiguration } from "@typescript/index.js";
import { type EventStructure } from "@structures/Event.js";

export interface AutoCompleteStructureWithGuildsConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, guildsConfiguration: GuildsConfiguration, interaction: AutocompleteInteraction<"cached">): Awaitable<unknown>;
}
export interface AutoCompleteStructureWithoutGuildsConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: AutocompleteInteraction<"cached">): Awaitable<unknown>;
}
export type AutoCompleteStructure = AutoCompleteStructureWithGuildsConfiguration | AutoCompleteStructureWithoutGuildsConfiguration;

export interface ButtonStructureWithGuildsConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, guildsConfiguration: GuildsConfiguration, interaction: ButtonInteraction<"cached">): Awaitable<unknown>;
}
export interface ButtonStructureWithoutGuildsConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: ButtonInteraction<"cached">): Awaitable<unknown>;
}
export type ButtonStructure = ButtonStructureWithGuildsConfiguration | ButtonStructureWithoutGuildsConfiguration;

export interface CommandStructureWithGuildsConfiguration extends CommandInteractionStructure {
    execute(client: StelliaClient, guildsConfiguration: GuildsConfiguration, interaction: ChatInputCommandInteraction<"cached">): Awaitable<unknown>;
}
export interface CommandStructureWithoutGuildsConfiguration extends CommandInteractionStructure {
    execute(client: StelliaClient, interaction: ChatInputCommandInteraction<"cached">): Awaitable<unknown>;
}
export type CommandStructure = CommandStructureWithGuildsConfiguration | CommandStructureWithoutGuildsConfiguration;

export interface ContextMenuStructureWithGuildsConfiguration extends ContextMenuInteractionStructure {
    execute(client: StelliaClient, guildsConfiguration: GuildsConfiguration, interaction: MessageContextMenuCommandInteraction<"cached"> | UserContextMenuCommandInteraction<"cached">): Awaitable<unknown>;
}
export interface ContextMenuStructureWithoutGuildsConfiguration extends ContextMenuInteractionStructure {
    execute(client: StelliaClient, interaction: MessageContextMenuCommandInteraction<"cached"> | UserContextMenuCommandInteraction<"cached">): Awaitable<unknown>;
}
export type ContextMenuStructure = ContextMenuStructureWithGuildsConfiguration | ContextMenuStructureWithoutGuildsConfiguration;

export interface ModalStructureWithGuildsConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, guildsConfiguration: GuildsConfiguration, interaction: ModalSubmitInteraction<"cached">): Awaitable<unknown>;
}
export interface ModalStructureWithoutGuildsConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: ModalSubmitInteraction<"cached">): Awaitable<unknown>;
}
export type ModalStructure = ModalStructureWithGuildsConfiguration | ModalStructureWithoutGuildsConfiguration;

export interface SelectMenuStructureWithGuildsConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, guildsConfiguration: GuildsConfiguration, interaction: AnySelectMenuInteraction<"cached">): Awaitable<unknown>;
}
export interface SelectMenuStructureWithoutGuildsConfiguration extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: AnySelectMenuInteraction<"cached">): Awaitable<unknown>;
}
export type SelectMenuStructure = SelectMenuStructureWithGuildsConfiguration | SelectMenuStructureWithoutGuildsConfiguration;

export type AnyInteractionStructure = AutoCompleteStructure | ButtonStructure | CommandStructure | ContextMenuStructure | EventStructure | ModalStructure | SelectMenuStructure;

interface CommandInteractionStructure {
    data: SlashCommandOptionsOnlyBuilder;
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