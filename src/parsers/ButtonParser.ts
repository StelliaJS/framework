import { type APIButtonComponentWithCustomId, type APIButtonComponentWithURL, ButtonBuilder } from "discord.js";

export class ButtonParser {
    public static parseWithCustomId(data: APIButtonComponentWithCustomId): ButtonBuilder {
        const button = new ButtonBuilder();
        if (data.custom_id) button.setCustomId(data.custom_id);
        if (data.label) button.setLabel(data.label);
        if (data.style) button.setStyle(data.style);
        if (data.disabled) button.setDisabled(data.disabled);
        if (data.emoji) button.setEmoji(data.emoji);

        return button;
    }

    public static parseWithLink(data: APIButtonComponentWithURL): ButtonBuilder {
        const button = new ButtonBuilder();
        if (data.url) button.setURL(data.url);
        if (data.label) button.setLabel(data.label);
        if (data.style) button.setStyle(data.style);
        if (data.disabled) button.setDisabled(data.disabled);
        if (data.emoji) button.setEmoji(data.emoji);

        return button;
    }
}