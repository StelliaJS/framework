import { time, TimestampStyles } from "discord.js";

export namespace TimestampUtils {
	export const toShortTime = (timestamp: number): string => {
		return time(Math.round(timestamp / 1000), TimestampStyles.ShortTime);
	};

	export const toMediumTime = (timestamp: number): string => {
		return time(Math.round(timestamp / 1000), TimestampStyles.MediumTime);
	};

	export const toShortDate = (timestamp: number): string => {
		return time(Math.round(timestamp / 1000), TimestampStyles.ShortDate);
	};

	export const toLongDate = (timestamp: number): string => {
		return time(Math.round(timestamp / 1000), TimestampStyles.LongDate);
	};

	export const toLongDateShortTime = (timestamp: number): string => {
		return time(Math.round(timestamp / 1000), TimestampStyles.LongDateShortTime);
	};

	export const toFullDateShortTime = (timestamp: number): string => {
		return time(Math.round(timestamp / 1000), TimestampStyles.FullDateShortTime);
	};

	export const toShortDateShortTime = (timestamp: number): string => {
		return time(Math.round(timestamp / 1000), TimestampStyles.ShortDateShortTime);
	};

	export const toShortDateMediumTime = (timestamp: number): string => {
		return time(Math.round(timestamp / 1000), TimestampStyles.ShortDateMediumTime);
	};

	export const toRelativeTime = (timestamp: number): string => {
		return time(Math.round(timestamp / 1000), TimestampStyles.RelativeTime);
	};
}