import { time, TimestampStyles } from "discord.js";

export const formatTimestampToShortTime = (timestamp: number): string => {
	return time(Math.round(timestamp / 1000), TimestampStyles.ShortTime);
};

export const formatTimestampToMediumTime = (timestamp: number): string => {
	return time(Math.round(timestamp / 1000), TimestampStyles.MediumTime);
};

export const formatTimestampToShortDate = (timestamp: number): string => {
	return time(Math.round(timestamp / 1000), TimestampStyles.ShortDate);
};

export const formatTimestampToLongDate = (timestamp: number): string => {
	return time(Math.round(timestamp / 1000), TimestampStyles.LongDate);
};

export const formatTimestampToLongDateShortTime = (timestamp: number): string => {
	return time(Math.round(timestamp / 1000), TimestampStyles.LongDateShortTime);
};

export const formatTimestampToFullDateShortTime = (timestamp: number): string => {
	return time(Math.round(timestamp / 1000), TimestampStyles.FullDateShortTime);
};

export const formatTimestampToShortDateShortTime = (timestamp: number): string => {
	return time(Math.round(timestamp / 1000), TimestampStyles.ShortDateShortTime);
};

export const formatTimestampToShortDateMediumTime = (timestamp: number): string => {
	return time(Math.round(timestamp / 1000), TimestampStyles.ShortDateMediumTime);
};


export const formatTimestampToRelativeTime = (timestamp: number): string => {
	return time(Math.round(timestamp / 1000), TimestampStyles.RelativeTime);
};

