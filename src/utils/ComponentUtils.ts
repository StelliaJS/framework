import { type APIContainerComponent, type APIEmbed, embedLength, TextDisplayComponent } from "discord.js";

export namespace ComponentUtils {
	export const getEmbedContentLength = (embed: APIEmbed): number => {
		return embedLength(embed);
	};

	export const getContainerContentLength = (container: APIContainerComponent): number => {
		return container.components.reduce((total, component) => {
			if (component instanceof TextDisplayComponent) {
				return total + component.content.length;
			}

			return total;
		}, 0);
	};
}
