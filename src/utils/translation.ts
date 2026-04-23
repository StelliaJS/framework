import { t } from "i18next";
import { type StelliaLocale } from "@typescript/index.js";

type TranslateArgs = Record<string, unknown>;

export const translateToLocale = <T = unknown>(locale: StelliaLocale, key: string, args?: TranslateArgs): T => {
	return t(key, { ...args, lng: locale, interpolation: { escapeValue: false }, returnObjects: true }) as T;
};
