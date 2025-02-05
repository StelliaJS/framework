import {
    type AnySelectMenuInteraction,
    type AutocompleteInteraction,
    type ButtonInteraction,
    type ChatInputCommandInteraction,
    type ContextMenuCommandInteraction,
    type ModalSubmitInteraction,
    type UserContextMenuCommandInteraction
} from "discord.js";
import {
    type AutoCompleteManager,
    type ButtonManager,
    type CommandManager,
    type ContextMenuManager,
    type EventManager,
    type ModalManager,
    type SelectMenuManager
} from "@managers/index.js";

export type StructureCustomId = string | RegExp;
export type InteractionCustomId = string;

export type AnyInteraction = AutocompleteInteraction<"cached">
    | ButtonInteraction<"cached">
    | ChatInputCommandInteraction<"cached">
    | ContextMenuCommandInteraction<"cached">
    | ModalSubmitInteraction<"cached">
    | AnySelectMenuInteraction<"cached">
    | UserContextMenuCommandInteraction<"cached">;

export enum InteractionType {
    Autocomplete = "Autocomplete",
    Button = "Button",
    ChatInputCommand = "ChatInputCommand",
    ContextMenuCommand = "ContextMenuCommand",
    ModalSubmit = "ModalSubmit",
    SelectMenu = "SelectMenu",
    Unknown = "Unknown"
}

export type Manager = AutoCompleteManager | ButtonManager | CommandManager | ContextMenuManager | EventManager | ModalManager | SelectMenuManager;
export interface Managers {
    autoCompletes?: AutoCompleteManager;
    buttons?: ButtonManager;
    commands?: CommandManager;
    contextMenus?: ContextMenuManager;
    events?: EventManager;
    selectMenus?: SelectMenuManager;
    modals?: ModalManager;
}

export interface Environment {
    isEnvironmentsEnabled: boolean;
}
export interface EnvironmentConfiguration {
    [key: string]: unknown;
}