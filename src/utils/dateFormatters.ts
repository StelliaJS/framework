import { time, TimestampStyles } from "discord.js";

export const formatTimestampToShortDateTime = (timestamp: number): string => {
    return time(Math.round(timestamp / 1000), TimestampStyles.ShortDateTime);
}

export const formatTimestampToShortTime = (timestamp: number): string => {
    return time(Math.round(timestamp / 1000), TimestampStyles.ShortTime);
}

export const formatTimestampToShortDate = (timestamp: number): string => {
    return time(Math.round(timestamp / 1000), TimestampStyles.ShortDate);
}

export const formatTimestampToLongDateTime = (timestamp: number): string => {
    return time(Math.round(timestamp / 1000), TimestampStyles.LongDateTime);
}

export const formatTimestampToLongTime = (timestamp: number): string => {
    return time(Math.round(timestamp / 1000), TimestampStyles.LongTime);
}

export const formatTimestampToLongDate = (timestamp: number): string => {
    return time(Math.round(timestamp / 1000), TimestampStyles.LongDate);
}

export const formatTimestampToRelativeTime = (timestamp: number): string => {
    return time(Math.round(timestamp / 1000), TimestampStyles.RelativeTime);
}