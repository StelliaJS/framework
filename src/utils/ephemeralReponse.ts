import { type BaseMessageOptions, MessageFlags, type RepliableInteraction } from "discord.js";

export const ephemeralFollowUpResponse = async (interaction: RepliableInteraction, data: string | BaseMessageOptions, automaticDeletion: boolean = false) => {
    if (!interaction.deferred) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    }

    if (typeof data === "string") {
        await interaction.followUp({ content: data, flags: MessageFlags.Ephemeral });
    } else {
        await interaction.followUp({ ...data, flags: MessageFlags.Ephemeral });
    }

    if (automaticDeletion) {
        setTimeout(() => {
            try {
                interaction.deleteReply();
            } catch {}
        }, 60 * 1000);
    }
}

export const ephemeralReplyResponse = async (interaction: RepliableInteraction, data: BaseMessageOptions, automaticDeletion: boolean = false) => {
    if (!interaction.deferred) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    }

    if (typeof data === "string") {
        await interaction.reply({ content: data, flags: MessageFlags.Ephemeral });
    } else {
        await interaction.reply({ ...data, flags: MessageFlags.Ephemeral });
    }

    if (automaticDeletion) {
        setTimeout(() => {
            try {
                interaction.deleteReply();
            } catch {}
        }, 60 * 1000);
    }
}
