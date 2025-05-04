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
import { type EnvironmentConfiguration } from "@typescript/index.js";
import { type EventStructure } from "@structures/Event.js";

export interface AutoCompleteStructureWithEnvironment extends MessageInteractionStructure {
    execute(client: StelliaClient, environment: EnvironmentConfiguration, interaction: AutocompleteInteraction<"cached">): Awaitable<unknown>;
}
export interface AutoCompleteStructureWithoutEnvironment extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: AutocompleteInteraction<"cached">): Awaitable<unknown>;
}
export type AutoCompleteStructure = AutoCompleteStructureWithEnvironment | AutoCompleteStructureWithoutEnvironment;

export interface ButtonStructureWithEnvironment extends MessageInteractionStructure {
    execute(client: StelliaClient, environment: EnvironmentConfiguration, interaction: ButtonInteraction<"cached">): Awaitable<unknown>;
}
export interface ButtonStructureWithoutEnvironment extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: ButtonInteraction<"cached">): Awaitable<unknown>;
}
export type ButtonStructure = ButtonStructureWithEnvironment | ButtonStructureWithoutEnvironment;

export interface CommandStructureWithEnvironment extends CommandInteractionStructure {
    execute(client: StelliaClient, environment: EnvironmentConfiguration, interaction: ChatInputCommandInteraction<"cached">): Awaitable<unknown>;
}
export interface CommandStructureWithoutEnvironment extends CommandInteractionStructure {
    execute(client: StelliaClient, interaction: ChatInputCommandInteraction<"cached">): Awaitable<unknown>;
}
export type CommandStructure = CommandStructureWithEnvironment | CommandStructureWithoutEnvironment;

export interface ContextMenuStructureWithEnvironment extends ContextMenuInteractionStructure {
    execute(client: StelliaClient, environment: EnvironmentConfiguration, interaction: MessageContextMenuCommandInteraction<"cached"> | UserContextMenuCommandInteraction<"cached">): Awaitable<unknown>;
}
export interface ContextMenuStructureWithoutEnvironment extends ContextMenuInteractionStructure {
    execute(client: StelliaClient, interaction: MessageContextMenuCommandInteraction<"cached"> | UserContextMenuCommandInteraction<"cached">): Awaitable<unknown>;
}
export type ContextMenuStructure = ContextMenuStructureWithEnvironment | ContextMenuStructureWithoutEnvironment;

export interface ModalStructureWithEnvironment extends MessageInteractionStructure {
    execute(client: StelliaClient, environment: EnvironmentConfiguration, interaction: ModalSubmitInteraction<"cached">): Awaitable<unknown>;
}
export interface ModalStructureWithoutEnvironment extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: ModalSubmitInteraction<"cached">): Awaitable<unknown>;
}
export type ModalStructure = ModalStructureWithEnvironment | ModalStructureWithoutEnvironment;

export interface SelectMenuStructureWithEnvironment extends MessageInteractionStructure {
    execute(client: StelliaClient, environment: EnvironmentConfiguration, interaction: AnySelectMenuInteraction<"cached">): Awaitable<unknown>;
}
export interface SelectMenuStructureWithoutEnvironment extends MessageInteractionStructure {
    execute(client: StelliaClient, interaction: AnySelectMenuInteraction<"cached">): Awaitable<unknown>;
}
export type SelectMenuStructure = SelectMenuStructureWithEnvironment | SelectMenuStructureWithoutEnvironment;

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