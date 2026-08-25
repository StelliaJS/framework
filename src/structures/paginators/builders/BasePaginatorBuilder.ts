import { type ComponentEmojiResolvable, type ContainerBuilder } from "discord.js";

export abstract class BasePaginatorBuilder<T extends unknown[]> {
	protected pages: T;
	protected timeout?: number;
	protected firstPageLabel?: string;
	protected previousPageLabel?: string;
	protected nextPageLabel?: string;
	protected lastPageLabel?: string;
	protected firstPageEmoji?: ComponentEmojiResolvable;
	protected previousPageEmoji?: ComponentEmojiResolvable;
	protected nextPageEmoji?: ComponentEmojiResolvable;
	protected lastPageEmoji?: ComponentEmojiResolvable;
	protected showFirstLastButtons?: boolean;

	setPages(pages: T): this {
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

	setFirstPageEmoji(emoji: ComponentEmojiResolvable): this {
		this.firstPageEmoji = emoji;
		return this;
	}

	setPreviousPageEmoji(emoji: ComponentEmojiResolvable): this {
		this.previousPageEmoji = emoji;
		return this;
	}

	setNextPageEmoji(emoji: ComponentEmojiResolvable): this {
		this.nextPageEmoji = emoji;
		return this;
	}

	setLastPageEmoji(emoji: ComponentEmojiResolvable): this {
		this.lastPageEmoji = emoji;
		return this;
	}

	setShowFirstLastButtons(show: boolean): this {
		this.showFirstLastButtons = show;
		return this;
	}
}
