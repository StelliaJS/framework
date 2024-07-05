import {
    type AnySelectMenuInteraction,
    type AutocompleteInteraction,
    type ButtonInteraction,
    type ChatInputCommandInteraction,
    type ContextMenuCommandInteraction,
    type ModalSubmitInteraction,
    type UserContextMenuCommandInteraction
} from "discord.js";

export type CustomId = string;

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