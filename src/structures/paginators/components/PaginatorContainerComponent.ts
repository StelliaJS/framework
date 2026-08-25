import {
	type BaseMessageOptions,
	ContainerBuilder,
	type Message,
	type MessageEditOptions,
	MessageFlags,
	type RepliableInteraction,
	SeparatorBuilder,
	SeparatorSpacingSize
} from "discord.js";
import {
	BasePaginatorComponent,
	type BasePaginatorComponentConfiguration
} from "structures/paginators/components/BasePaginatorComponent.js";

type PaginatorContainerConfiguration = BasePaginatorComponentConfiguration<ContainerBuilder[]>;

export interface PaginatorContainerComponents {
	components: BaseMessageOptions["components"];
	attachCollector: (message: Message, interaction?: RepliableInteraction, filterUserId?: string) => void;
}

export class PaginatorContainerComponent extends BasePaginatorComponent<ContainerBuilder[]> {
	protected readonly paginatorInteractionCustomIds = {
		first: "__paginator_container_first__",
		previous: "__paginator_container_previous__",
		next: "__paginator_container_next__",
		last: "__paginator_container_last__"
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
	}: PaginatorContainerConfiguration) {
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

	build(): PaginatorContainerComponents {
		this.currentPage = 0;

		return {
			components: [this.buildCurrentContainer()],
			attachCollector: (message: Message, interaction?: RepliableInteraction, filterUserId?: string) => {
				this.attachCollector(message, interaction, filterUserId);
			}
		};
	}

	protected buildUpdatePayload(disabled = false): MessageEditOptions {
		return {
			components: [this.buildCurrentContainer(disabled)],
			flags: MessageFlags.IsComponentsV2 as const
		};
	}

	private buildCurrentContainer(disabled = false): ContainerBuilder {
		const originalContainer = this.pages[this.currentPage];
		if (!this.isPaginated) {
			return originalContainer;
		}

		const container = new ContainerBuilder(originalContainer.toJSON());
		return container
			.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
			.addActionRowComponents(this.buildPaginatorRow(disabled));
	}
}
