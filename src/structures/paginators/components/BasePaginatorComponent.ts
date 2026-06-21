import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	type ComponentEmojiResolvable,
	ComponentType,
	type Message,
	type MessageEditOptions,
	type RepliableInteraction
} from "discord.js";
import { logger } from "@utils/index.js";

export interface BasePaginatorComponentConfiguration<T extends unknown[]> {
	pages: T;
	timeout?: number;
	firstPageLabel?: string;
	previousPageLabel?: string;
	nextPageLabel?: string;
	lastPageLabel?: string;
	firstPageEmoji?: ComponentEmojiResolvable;
	previousPageEmoji?: ComponentEmojiResolvable;
	nextPageEmoji?: ComponentEmojiResolvable;
	lastPageEmoji?: ComponentEmojiResolvable;
	showFirstLastButtons?: boolean;
	filterUserId?: string;
}

export abstract class BasePaginatorComponent<T extends unknown[]> {
	protected abstract readonly paginatorInteractionCustomIds: {
		first: string;
		previous: string;
		next: string;
		last: string;
	};

	protected readonly pages: T;
	protected readonly timeout: number;
	protected readonly firstPageLabel: string;
	protected readonly previousPageLabel: string;
	protected readonly nextPageLabel: string;
	protected readonly lastPageLabel: string;
	protected readonly firstPageEmoji?: ComponentEmojiResolvable;
	protected readonly previousPageEmoji?: ComponentEmojiResolvable;
	protected readonly nextPageEmoji?: ComponentEmojiResolvable;
	protected readonly lastPageEmoji?: ComponentEmojiResolvable;
	protected readonly showFirstLastButtons: boolean;

	protected currentPage = 0;

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
	}: BasePaginatorComponentConfiguration<T>) {
		if (pages.length === 0) {
			logger.error("Paginator: at least one page is required");
			return;
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

	protected abstract buildUpdatePayload(disabled?: boolean): MessageEditOptions;

	protected attachCollector(message: Message, interaction?: RepliableInteraction, filterUserId?: string): void {
		if (!this.isPaginated) {
			return;
		}

		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter: filterUserId ? (i) => i.user.id === filterUserId : undefined,
			time: this.timeout
		});

		collector.on("collect", async (buttonInteraction: ButtonInteraction) => {
			if (!this.handleNavigation(buttonInteraction.customId)) {
				return;
			}

			await buttonInteraction.update(this.buildUpdatePayload());
		});

		collector.on("end", async () => {
			const disabledPayload = this.buildUpdatePayload(true);

			if (interaction) {
				await interaction.editReply(disabledPayload).catch(console.error);
			} else {
				await message.edit(disabledPayload).catch(console.error);
			}
		});
	}

	protected buildPaginatorRow(disabled = false): ActionRowBuilder<ButtonBuilder> {
		return new ActionRowBuilder<ButtonBuilder>().addComponents(this.buildPaginatorButtons(disabled));
	}

	protected handleNavigation(customId: string): boolean {
		switch (customId) {
			case this.paginatorInteractionCustomIds.first:
				this.currentPage = 0;
				break;
			case this.paginatorInteractionCustomIds.previous:
				this.currentPage = Math.max(0, this.currentPage - 1);
				break;
			case this.paginatorInteractionCustomIds.next:
				this.currentPage = Math.min(this.pages.length - 1, this.currentPage + 1);
				break;
			case this.paginatorInteractionCustomIds.last:
				this.currentPage = this.pages.length - 1;
				break;
			default:
				return false;
		}

		return true;
	}

	protected buildPaginatorButtons(disabled = false): ButtonBuilder[] {
		const buttons: ButtonBuilder[] = [];

		if (this.showFirstLastButtons && this.pages.length > 2) {
			const firstButton = new ButtonBuilder()
				.setCustomId(this.paginatorInteractionCustomIds.first)
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
			.setCustomId(this.paginatorInteractionCustomIds.previous)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(disabled || this.isFirstPage);

		if (this.previousPageEmoji) {
			previousButton.setEmoji(this.previousPageEmoji);
		} else {
			previousButton.setLabel(this.previousPageLabel);
		}

		buttons.push(previousButton);

		const nextButton = new ButtonBuilder()
			.setCustomId(this.paginatorInteractionCustomIds.next)
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
				.setCustomId(this.paginatorInteractionCustomIds.last)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(disabled || this.isLastPage);

			if (this.lastPageEmoji) {
				lastButton.setEmoji(this.lastPageEmoji);
			} else {
				lastButton.setLabel(this.lastPageLabel);
			}

			buttons.push(lastButton);
		}

		return buttons;
	}

	protected get isPaginated(): boolean {
		return this.pages.length > 1;
	}

	protected get isFirstPage(): boolean {
		return this.currentPage === 0;
	}

	protected get isLastPage(): boolean {
		return this.currentPage === this.pages.length - 1;
	}
}