import { type BaseMessageOptions, type RepliableInteraction } from "discord.js";

export const ephemeralFollowUpResponse = async (interaction: RepliableInteraction, data: string | BaseMessageOptions, automaticDeletion: boolean = false) => {
    if (!interaction.deferred) {
        await interaction.deferReply({ ephemeral: true });
    }

    if (typeof data === "string") {
        await interaction.followUp({ content: data, ephemeral: true });
    } else {
        await interaction.followUp({ ...data, ephemeral: true });
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
        await interaction.deferReply({ ephemeral: true });
    }

    if (typeof data === "string") {
        await interaction.reply({ content: data, ephemeral: true });
    } else {
        await interaction.reply({ ...data, ephemeral: true });
    }

    if (automaticDeletion) {
        setTimeout(() => {
            try {
                interaction.deleteReply();
            } catch {}
        }, 60 * 1000);
    }
}
