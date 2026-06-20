import { type APIContainerComponent, type APIEmbed, embedLength, TextDisplayComponent } from "discord.js";

export namespace ComponentUtils {
    export const getEmbedContentLength = (embed: APIEmbed) => {
		return embedLength(embed);
	};

    export const getContainerContentLength = (container: APIContainerComponent) => {
        return container.components.map((component) => {
            if (component instanceof TextDisplayComponent) {
                return component.content.length;
            }

            return 0;
        }).reduce((a, b) => a + b);
	};
}