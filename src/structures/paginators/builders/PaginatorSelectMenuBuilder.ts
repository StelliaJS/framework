import { type APISelectMenuOption, type ComponentEmojiResolvable } from "discord.js";
import {
	type PaginatorComponents,
	PaginatorSelectMenu
} from "@structures/paginators/components/PaginatorSelectMenu.js";

export class PaginatorSelectMenuBuilder {
	private customId: string;
	private options: APISelectMenuOption[] = [];
	private placeholder?: string;
	private chunkSize?: number;
	private timeout?: number;
	private nextPageLabel?: string;
	private nextPageEmoji: ComponentEmojiResolvable;
	private previousPageLabel?: string;
	private previousPageEmoji: ComponentEmojiResolvable;

	setCustomId(customId: string): this {
		this.customId = customId;
		return this;
	}

	setOptions(options: APISelectMenuOption[]): this {
		this.options = options;
		return this;
	}

	addOption(option: APISelectMenuOption): this {
		this.options.push(option);
		return this;
	}

	setPlaceholder(placeholder: string): this {
		this.placeholder = placeholder;
		return this;
	}

	setChunkSize(chunkSize: number): this {
		this.chunkSize = chunkSize;
		return this;
	}

	setTimeout(timeout: number): this {
		this.timeout = timeout * 1000;
		return this;
	}

	setNextPageLabel(label: string): this {
		this.nextPageLabel = label;
		return this;
	}

	setNextPageEmoji(emoji: ComponentEmojiResolvable): this {
		this.nextPageEmoji = emoji;
		return this;
	}

	setPreviousPageLabel(label: string): this {
		this.previousPageLabel = label;
		return this;
	}

	setPreviousPageEmoji(emoji: ComponentEmojiResolvable): this {
		this.previousPageEmoji = emoji;
		return this;
	}

	build(): PaginatorComponents {
		if (!this.customId) {
			throw new Error("PaginatorSelectMenuBuilder: customId is required.");
		}
		if (!this.options.length) {
			throw new Error("PaginatorSelectMenuBuilder: at least one option is required.");
		}

		return new PaginatorSelectMenu({
			customId: this.customId,
			options: this.options,
			placeholder: this.placeholder,
			chunkSize: this.chunkSize,
			timeout: this.timeout,
			nextPageLabel: this.nextPageLabel,
			nextPageEmoji: this.nextPageEmoji,
			previousPageLabel: this.previousPageLabel,
			previousPageEmoji: this.previousPageEmoji
		}).build();
	}
}
