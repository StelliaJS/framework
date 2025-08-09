import { type Locale } from "discord.js";
import { changeLanguage, t } from "i18next";

interface TranslateArgs {
	[key: string]: any;
}

export const translateToLocale = async (locale: Locale, key: string, args?: TranslateArgs): Promise<any> => {
	await changeLanguage(locale);
	return t(key, { interpolation: { escapeValue: false }, returnObjects: true, ...args });
};
