import { type Locale } from "discord.js";
import { t } from "i18next";

type TranslateArgs = Record<string, unknown>;

export const translateToLocale = <T = unknown>(locale: Locale, key: string, args?: TranslateArgs): T => {
	return t(key, { lng: locale, interpolation: { escapeValue: false }, returnObjects: true, ...args }) as T;
};
