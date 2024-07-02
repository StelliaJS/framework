import {
    type AnySelectMenuInteraction,
    type AutocompleteInteraction,
    type Awaitable,
    type ButtonInteraction,
    type ChatInputCommandInteraction,
    type ContextMenuCommandBuilder,
    type MessageContextMenuCommandInteraction,
    type ModalSubmitInteraction,
    type SlashCommandBuilder,
    type UserContextMenuCommandInteraction
} from "discord.js";
import { type StellaClient } from "@client/index.js";

export interface AutoCompleteStructure {
    data: DefaultDataStructure;
    execute(client: StellaClient, interaction: AutocompleteInteraction<"cached">): Awaitable<unknown>;
}

export interface ButtonStructure {
    data: DefaultDataStructure;
    execute(client: StellaClient, interaction: ButtonInteraction<"cached">): Awaitable<unknown>;
}

export interface CommandStructure {
    data: SlashCommandBuilder;
    execute(client: StellaClient, interaction: ChatInputCommandInteraction<"cached">): Awaitable<unknown>;
}

export interface ContextMenuStructure {
    data: ContextMenuCommandBuilder;
    execute(client: StellaClient, interaction: MessageContextMenuCommandInteraction<"cached"> | UserContextMenuCommandInteraction<"cached">): Awaitable<unknown>;
}

export interface ModalStructure {
    data: DefaultDataStructure;
    execute(client: StellaClient, interaction: ModalSubmitInteraction<"cached">): Awaitable<unknown>;
}

export interface SelectMenuStructure {
    data: DefaultDataStructure;
    execute(client: StellaClient, interaction: AnySelectMenuInteraction<"cached">): Awaitable<unknown>;
}

export type AnyInteractionStructure = AutoCompleteStructure | ButtonStructure | CommandStructure | ContextMenuStructure | ModalStructure | SelectMenuStructure;

interface DefaultDataStructure {
    name: string;
    once: boolean;
}