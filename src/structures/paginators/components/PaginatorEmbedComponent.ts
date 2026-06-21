import {
	type ActionRowBuilder,
	type APIEmbed,
	type ButtonBuilder,
	type Message,
	type MessageEditOptions,
	type RepliableInteraction
} from "discord.js";
import {
	BasePaginatorComponent, type BasePaginatorComponentConfiguration
} from "structures/paginators/components/BasePaginatorComponent.js";

interface PaginatorEmbedConfiguration extends BasePaginatorComponentConfiguration<APIEmbed[]> {}

export interface PaginatorEmbedComponents {
	embeds: APIEmbed[];
	components: ActionRowBuilder<ButtonBuilder>[];
	attachCollector: (message: Message, interaction?: RepliableInteraction, filterUserId?: string) => void;
}

export class PaginatorEmbedComponent extends BasePaginatorComponent<APIEmbed[]> {
	protected readonly paginatorInteractionCustomIds = {
		first: "__paginator_embed_first__",
		previous: "__paginator_embed_previous__",
		next: "__paginator_embed_next__",
		last: "__paginator_embed_last__"
	};

	constructor({
		pages,
		timeout = 60_000,
		firstPageLabel = "First",
		previousPageLabel = "Previous",
		nextPageLabel = "Next",
		lastPageLabel = "Last",
		firstPageEmoji,
		previousPageEmoji,
		nextPageEmoji,
		lastPageEmoji,
		showFirstLastButtons = true
	}: PaginatorEmbedConfiguration) {
		super({
			pages,
			timeout,
			firstPageLabel,
			previousPageLabel,
			nextPageLabel,
			lastPageLabel,
			firstPageEmoji,
			previousPageEmoji,
			nextPageEmoji,
			lastPageEmoji,
			showFirstLastButtons
		});
	}

	build(): PaginatorEmbedComponents {
		this.currentPage = 0;

		return {
			embeds: [this.buildCurrentEmbed()],
			components: this.isPaginated ? [this.buildPaginatorRow()] : [],
			attachCollector: (message: Message, interaction?: RepliableInteraction, filterUserId?: string) => {
				this.attachCollector(message, interaction, filterUserId);
			}
		};
	}

	protected buildUpdatePayload(disabled = false): MessageEditOptions {
		return {
			embeds: [this.buildCurrentEmbed()],
			components: [this.buildPaginatorRow(disabled)]
		};
	}

	private buildCurrentEmbed(): APIEmbed {
		return this.pages[this.currentPage];
	}
}
