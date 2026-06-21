import { type ContainerBuilder } from "discord.js";
import { BasePaginatorBuilder } from "structures/paginators/builders/BasePaginatorBuilder.js";
import { PaginatorContainerComponent, type PaginatorContainerComponents } from "structures/paginators/components/PaginatorContainerComponent.js";

export class PaginatorContainerBuilder extends BasePaginatorBuilder<ContainerBuilder[]>{
	build(): PaginatorContainerComponents {
		return new PaginatorContainerComponent({
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
