import { type ContainerBuilder } from "discord.js";
import { PaginatorContainer, type PaginatorContainerComponents } from "@structures/paginators/components/PaginatorContainer.js";

export class PaginatorContainerBuilder {
	private pages: ContainerBuilder[] = [];
	private timeout?: number;
	private firstPageLabel?: string;
	private previousPageLabel?: string;
	private nextPageLabel?: string;
	private lastPageLabel?: string;
	private firstPageEmoji?: string;
	private previousPageEmoji?: string;
	private nextPageEmoji?: string;
	private lastPageEmoji?: string;
	private showFirstLastButtons?: boolean;

	setPages(pages: ContainerBuilder[]): this {
		this.pages = pages;
		return this;
	}

	addPage(page: ContainerBuilder): this {
		this.pages.push(page);
		return this;
	}

	setTimeout(seconds: number): this {
		this.timeout = seconds * 1000;
		return this;
	}

	setFirstPageLabel(label: string): this {
		this.firstPageLabel = label;
		return this;
	}

	setPreviousPageLabel(label: string): this {
		this.previousPageLabel = label;
		return this;
	}

	setNextPageLabel(label: string): this {
		this.nextPageLabel = label;
		return this;
	}

	setLastPageLabel(label: string): this {
		this.lastPageLabel = label;
		return this;
	}

	setFirstPageEmoji(emoji: string): this {
		this.firstPageEmoji = emoji;
		return this;
	}

	setPreviousPageEmoji(emoji: string): this {
		this.previousPageEmoji = emoji;
		return this;
	}

	setNextPageEmoji(emoji: string): this {
		this.nextPageEmoji = emoji;
		return this;
	}

	setLastPageEmoji(emoji: string): this {
		this.lastPageEmoji = emoji;
		return this;
	}

	setShowFirstLastButtons(show: boolean): this {
		this.showFirstLastButtons = show;
		return this;
	}

	build(): PaginatorContainerComponents {
		if (!this.pages.length) {
			throw new Error("PaginatorContainerBuilder: at least one page is required.");
		}

		return new PaginatorContainer({
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
			showFirstLastButtons: this.showFirstLastButtons
		}).build();
	}
}
