import { i18n, t } from "i18next";
import { type StelliaLocale } from "@typescript/index.js";

type TranslateArgs = Record<string, unknown>;

let _instance: i18n;

export const initTranslations = (instance: i18n) => {
	_instance = instance;
};

export const translateToLocale = <T = unknown>(locale: StelliaLocale, key: string, args?: TranslateArgs): T => {
	return _instance.t(key, { ...args, lng: locale, interpolation: { escapeValue: false }, returnObjects: true }) as T;
};
