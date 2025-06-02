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

export interface ClientEnvironment {
    areGuildsConfigurationEnabled: boolean;
}
export interface GuildsConfiguration {
    [key: string]: unknown;
    guilds: {
        [guildId: string]: {
            locale: string;
            [key: string]: unknown;
        };
    }
}
