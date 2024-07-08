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

export type InteractionData = {
    commandName: string;
    commandOptions?: CommandOptions;
    autoCompletes?: AutoCompletes;
    buttons?: Buttons;
    modals?: Modals;
    selectMenus?: SelectMenus;
}

type CommandOptions = {
    [key: string]: string;
}

type AutoCompletes = {
    [key: string]: string;
}

type Buttons = {
    [key: string]: string;
}

type Modals = {
    [key: string]: {
        customId: string;
        [key: string]: string;
    };
}

type SelectMenus = {
    [key: string]: string;
}