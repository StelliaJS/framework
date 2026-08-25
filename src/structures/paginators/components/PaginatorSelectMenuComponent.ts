import {
	ActionRowBuilder,
	type APISelectMenuOption,
	type ComponentEmojiResolvable,
	ComponentType,
	type Message,
	type RepliableInteraction,
	StringSelectMenuBuilder,
	type StringSelectMenuInteraction,
	StringSelectMenuOptionBuilder
} from "discord.js";

interface PaginatorSelectMenuConfiguration {
	customId: string;
	options: APISelectMenuOption[];
	placeholder?: string;
	chunkSize?: number;
	timeout?: number;
	nextPageLabel?: string;
	nextPageEmoji?: ComponentEmojiResolvable;
	previousPageLabel?: string;
	previousPageEmoji?: ComponentEmojiResolvable;
}

export interface PaginatorSelectMenuComponents {
	components: ActionRowBuilder<StringSelectMenuBuilder>[];
	attachCollector: (message: Message, interaction?: RepliableInteraction, filterUserId?: string) => void;
}

const NEXT_PAGE_VALUE = "__paginator_next__";
const PREV_PAGE_VALUE = "__paginator_previous__";

export class PaginatorSelectMenuComponent {
	private readonly customId: string;
	private readonly options: APISelectMenuOption[];
	private readonly chunks: APISelectMenuOption[][];
	private readonly placeholder: string;
	private readonly chunkSize: number;
	private readonly timeout: number;
	private readonly nextPageLabel: string;
	private readonly nextPageEmoji?: ComponentEmojiResolvable;
	private readonly previousPageLabel: string;
	private readonly previousPageEmoji?: ComponentEmojiResolvable;

	private currentChunk = 0;

	constructor({
		customId,
		options,
		placeholder = "",
		chunkSize = 23,
		timeout = 60_000,
		nextPageLabel = "Next page",
		nextPageEmoji,
		previousPageLabel = "Previous page",
		previousPageEmoji
	}: PaginatorSelectMenuConfiguration) {
		if (options.length === 0) {
			throw new Error("PaginatorSelectMenu: at least one option is required.");
		}

		if (chunkSize < 1 || chunkSize > 23) {
			throw new Error("PaginatorSelectMenu: chunkSize must be between 1 and 23.");
		}

		this.customId = customId;
		this.options = options;
		this.chunkSize = chunkSize;
		this.placeholder = placeholder;
		this.timeout = timeout;
		this.nextPageLabel = nextPageLabel;
		this.nextPageEmoji = nextPageEmoji;
		this.previousPageLabel = previousPageLabel;
		this.previousPageEmoji = previousPageEmoji;
		this.chunks = this.buildChunks();
	}

	build(): PaginatorSelectMenuComponents {
		this.currentChunk = 0;

		return {
			components: this.buildComponents(),
			attachCollector: (message: Message, interaction?: RepliableInteraction, filterUserId?: string) => {
				this.attachCollector(message, interaction, filterUserId);
			}
		};
	}

	private attachCollector(message: Message, interaction?: RepliableInteraction, filterUserId?: string): void {
		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			filter: filterUserId ? (i) => i.user.id === filterUserId : undefined,
			time: this.timeout
		});

		collector.on("collect", async (selectInteraction: StringSelectMenuInteraction<"cached">) => {
			const [value] = selectInteraction.values;
			if (value === NEXT_PAGE_VALUE || value === PREV_PAGE_VALUE) {
				this.currentChunk += value === NEXT_PAGE_VALUE ? 1 : -1;
				await selectInteraction.update({ components: this.buildComponents() });
			}
		});

		collector.on("end", async () => {
			const disabledComponents = { components: this.buildComponents(true) };
			if (interaction) {
				await interaction.editReply(disabledComponents).catch(console.error);
			} else {
				await message.edit(disabledComponents).catch(console.error);
			}
		});
	}

	private buildChunks(): APISelectMenuOption[][] {
		const chunks: APISelectMenuOption[][] = [];
		for (let i = 0; i < this.options.length; i += this.chunkSize) {
			chunks.push(this.options.slice(i, i + this.chunkSize));
		}

		return chunks;
	}

	private get isPaginated(): boolean {
		return this.chunks.length > 1;
	}

	private get isFirstChunk(): boolean {
		return this.currentChunk === 0;
	}

	private get isLastChunk(): boolean {
		return this.currentChunk === this.chunks.length - 1;
	}

	private buildPageRow(disabled = false): ActionRowBuilder<StringSelectMenuBuilder> {
		const chunk = this.chunks[this.currentChunk];
		const options: StringSelectMenuOptionBuilder[] = [];

		if (this.isPaginated && !this.isFirstChunk) {
			const previousPageOption = new StringSelectMenuOptionBuilder().setLabel(this.previousPageLabel).setValue(PREV_PAGE_VALUE);
			if (this.previousPageEmoji) {
				previousPageOption.setEmoji(this.previousPageEmoji);
			}

			options.push(previousPageOption);
		}

		for (const page of chunk) {
			const option = new StringSelectMenuOptionBuilder().setLabel(page.label).setValue(page.value);

			if (page.description) {
				option.setDescription(page.description);
			}
			if (page.emoji) {
				option.setEmoji(page.emoji);
			}

			options.push(option);
		}

		if (this.isPaginated && !this.isLastChunk) {
			const previousPageOption = new StringSelectMenuOptionBuilder().setLabel(this.nextPageLabel).setValue(NEXT_PAGE_VALUE);
			if (this.nextPageEmoji) {
				previousPageOption.setEmoji(this.nextPageEmoji);
			}

			options.push(previousPageOption);
		}

		return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId(this.customId)
				.setPlaceholder(this.placeholder)
				.setDisabled(disabled)
				.addOptions(options)
		);
	}

	private buildComponents(disabled = false): ActionRowBuilder<StringSelectMenuBuilder>[] {
		return [this.buildPageRow(disabled)];
	}
}
