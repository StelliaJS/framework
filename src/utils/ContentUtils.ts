export namespace ContentUtils {
	export const ellipsis = (content: string, max: number) => {
		return content.length > max ? content.slice(0, max) + "..." : content;
	};
}
