import {
	ActionRowBuilder,
	type APIEmbed,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	ComponentType,
	type Message,
	type RepliableInteraction
} from "discord.js";

interface PaginatorEmbedConfiguration {
	pages: APIEmbed[];
	timeout?: number;
	firstPageLabel?: string;
	previousPageLabel?: string;
	nextPageLabel?: string;
	lastPageLabel?: string;
	firstPageEmoji?: string;
	previousPageEmoji?: string;
	nextPageEmoji?: string;
	lastPageEmoji?: string;
	showFirstLastButtons?: boolean;
	filterUserId?: string;
}

export interface PaginatorEmbedComponents {
	embeds: APIEmbed[];
	components: ActionRowBuilder<ButtonBuilder>[];
	attachCollector: (message: Message, interaction?: RepliableInteraction, filterUserId?: string) => void;
}

const FIRST_PAGE_ID = "__paginator_embed_first__";
const PREV_PAGE_ID = "__paginator_embed_prev__";
const NEXT_PAGE_ID = "__paginator_embed_next__";
const LAST_PAGE_ID = "__paginator_embed_last__";

export class PaginatorEmbed {
	private readonly pages: APIEmbed[];
	private readonly timeout: number;
	private readonly firstPageLabel: string;
	private readonly previousPageLabel: string;
	private readonly nextPageLabel: string;
	private readonly lastPageLabel: string;
	private readonly firstPageEmoji?: string;
	private readonly previousPageEmoji?: string;
	private readonly nextPageEmoji?: string;
	private readonly lastPageEmoji?: string;
	private readonly showFirstLastButtons: boolean;

	private currentPage = 0;

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
		if (pages.length === 0) {
			throw new Error("PaginatorEmbed: at least one page is required.");
		}

		this.pages = pages;
		this.timeout = timeout;
		this.firstPageLabel = firstPageLabel;
		this.previousPageLabel = previousPageLabel;
		this.nextPageLabel = nextPageLabel;
		this.lastPageLabel = lastPageLabel;
		this.firstPageEmoji = firstPageEmoji;
		this.previousPageEmoji = previousPageEmoji;
		this.nextPageEmoji = nextPageEmoji;
		this.lastPageEmoji = lastPageEmoji;
		this.showFirstLastButtons = showFirstLastButtons;
	}

	build(): PaginatorEmbedComponents {
		this.currentPage = 0;

		return {
			embeds: [this.buildCurrentEmbed()],
			components: this.isPaginated ? this.buildPaginatorComponents() : [],
			attachCollector: (message: Message, interaction?: RepliableInteraction, filterUserId?: string) => {
				this.attachCollector(message, interaction, filterUserId);
			}
		};
	}

	private attachCollector(message: Message, interaction?: RepliableInteraction, filterUserId?: string): void {
		if (!this.isPaginated) {
			return;
		}

		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter: filterUserId ? (i) => i.user.id === filterUserId : undefined,
			time: this.timeout
		});

		collector.on("collect", async (buttonInteraction: ButtonInteraction) => {
			switch (buttonInteraction.customId) {
				case FIRST_PAGE_ID:
					this.currentPage = 0;
					break;
				case PREV_PAGE_ID:
					this.currentPage = Math.max(0, this.currentPage - 1);
					break;
				case NEXT_PAGE_ID:
					this.currentPage = Math.min(this.pages.length - 1, this.currentPage + 1);
					break;
				case LAST_PAGE_ID:
					this.currentPage = this.pages.length - 1;
					break;
				default:
					return;
			}

			await buttonInteraction.update({
				embeds: [this.buildCurrentEmbed()],
				components: this.buildPaginatorComponents()
			});
		});

		collector.on("end", async () => {
			const disabledPayload = {
				embeds: [this.buildCurrentEmbed()],
				components: this.buildPaginatorComponents(true)
			};

			if (interaction) {
				await interaction.editReply(disabledPayload).catch(console.error);
			} else {
				await message.edit(disabledPayload).catch(console.error);
			}
		});
	}

	private buildCurrentEmbed(): APIEmbed {
		return this.pages[this.currentPage];
	}

	private buildPaginatorComponents(disabled = false): ActionRowBuilder<ButtonBuilder>[] {
		const row = new ActionRowBuilder<ButtonBuilder>();
		const buttons: ButtonBuilder[] = [];

		if (this.showFirstLastButtons && this.pages.length > 2) {
			const firstButton = new ButtonBuilder()
				.setCustomId(FIRST_PAGE_ID)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(disabled || this.isFirstPage);

			if (this.firstPageEmoji) {
				firstButton.setEmoji(this.firstPageEmoji);
			} else {
				firstButton.setLabel(this.firstPageLabel);
			}

			buttons.push(firstButton);
		}

		const previousButton = new ButtonBuilder()
			.setCustomId(PREV_PAGE_ID)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(disabled || this.isFirstPage);

		if (this.previousPageEmoji) {
			previousButton.setEmoji(this.previousPageEmoji);
		} else {
			previousButton.setLabel(this.previousPageLabel);
		}

		buttons.push(previousButton);

		const nextButton = new ButtonBuilder()
			.setCustomId(NEXT_PAGE_ID)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(disabled || this.isLastPage);

		if (this.nextPageEmoji) {
			nextButton.setEmoji(this.nextPageEmoji);
		} else {
			nextButton.setLabel(this.nextPageLabel);
		}

		buttons.push(nextButton);

		if (this.showFirstLastButtons && this.pages.length > 2) {
			const lastButton = new ButtonBuilder()
				.setCustomId(LAST_PAGE_ID)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(disabled || this.isLastPage);

			if (this.lastPageEmoji) {
				lastButton.setEmoji(this.lastPageEmoji);
			} else {
				lastButton.setLabel(this.lastPageLabel);
			}

			buttons.push(lastButton);
		}

		return [row.addComponents(buttons)];
	}

	private get isPaginated(): boolean {
		return this.pages.length > 1;
	}

	private get isFirstPage(): boolean {
		return this.currentPage === 0;
	}

	private get isLastPage(): boolean {
		return this.currentPage === this.pages.length - 1;
	}
}
