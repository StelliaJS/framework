import i18next from "i18next";

interface TranslateArgs {
    [key: string]: any;
}

export enum Locale {
    EN = "en",
    FR = "fr"
}

export const translateToLocale = async (locale: Locale, key: string, args?: TranslateArgs): Promise<any> => {
    await i18next.changeLanguage(locale);
    return i18next.t(key, { interpolation: { escapeValue: false }, returnObjects: true, ...args });
}
