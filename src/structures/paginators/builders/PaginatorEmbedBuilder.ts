import { type APIEmbed } from "discord.js";
import { BasePaginatorBuilder } from "structures/paginators/builders/BasePaginatorBuilder.js";
import {
	PaginatorEmbedComponent, type PaginatorEmbedComponents
} from "structures/paginators/components/PaginatorEmbedComponent.js";

export class PaginatorEmbedBuilder extends BasePaginatorBuilder<APIEmbed[]> {
	build(): PaginatorEmbedComponents {
		return new PaginatorEmbedComponent({
			pages: this.pages,
			timeout: this.timeout,
			firstPageLabel: this.firstPageLabel,
			previousPageLabel: this.previousPageLabel,
			nextPageLabel: this.nextPageLabel,
			lastPageLabel: this.lastPageLabel,
			firstPageEmoji: this.firstPageEmoji,
			previousPageEmoji: this.previousPageEmoji,
			nextPageEmoji: this.nextPageEmoji,
			lastPageEmoji: this.lastPageEmoji,
			showFirstLastButtons: this.showFirstLastButtons,
		}).build();
	}
}
