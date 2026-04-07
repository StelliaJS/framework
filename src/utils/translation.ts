import { type Locale } from "discord.js";
import { changeLanguage, t } from "i18next";

type TranslateArgs = Record<string, unknown>;

export const translateToLocale = async <T = unknown>(locale: Locale, key: string, args?: TranslateArgs): Promise<T> => {
	await changeLanguage(locale);
	return t(key, { interpolation: { escapeValue: false }, returnObjects: true, ...args }) as T;
};
