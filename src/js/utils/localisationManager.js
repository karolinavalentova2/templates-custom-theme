export class TranslationsManager {
    static doGetStringByLang(KEY, LANGUAGE = null) {
        if(!TRANSLATION_STRINGS[KEY]) {
            throw new Error(`No such key found in the STRINGS translations: ${KEY}`);
        }
        return TRANSLATION_STRINGS[KEY][LANGUAGE || TranslationsManager.doGetLocaleLang()] || "NOT FOUND";
    }

    static doGetImageByLang(KEY, LANGUAGE = null) {
        if(!TRANSLATION_IMAGES[KEY]) {
            throw new Error(`No such key found in the IMAGES translations: ${KEY}`);
        }
        return TRANSLATION_IMAGES[KEY][LANGUAGE || TranslationsManager.doGetLocaleLang()] || "NOT FOUND";
    }

    static doGetLINKByLang(KEY, LANGUAGE = null) {
        if(!TRANSLATION_LINKS[KEY]) {
            throw new Error(`No such key found in the LINKS translations: ${KEY}`);
        }
        return TRANSLATION_LINKS[KEY][LANGUAGE || TranslationsManager.doGetLocaleLang()] || "/";
    }

    static doGetLocaleLang() {
        try {
            const currentLang = document.querySelector('html').getAttribute('lang');
            return String(currentLang).toUpperCase();
        } catch (e) {
            console.error(e);
            return 'CZ';
        }
    }
}


export const TRANSLATION_STRINGS = {
    APPLY_COUPON: {
        CS: "Mám slevový kupón",
    },
    APPLY_COUPON_MSG: {
        CS: "Pokud máte k dispozici kód pro poskytnutí slevy, zadejte ho zde a aktivujte pomocí tlačítka „Uplatnit“.",
    },
    DETAILED_FILTER: {
        CS: "Podrobný filtr",
        EN: "",
    },
    DETAILED_FILTERING: {
        CS: "Podrobné filtrování",
        EN: "",
    },
    CLOSE: {
        CS: "Zavřít",
        EN: "",
    },
    SHOW: {
        CS: "Zobrazit",
        EN: "",
    },
    SH_CLOSE_FILTER: {
        CS: "Zavřít filtr",
        EN: "",
    },
    SH_OPEN_FILTER: {
        CS: "Otevřít filtr",
        EN: "",
    },
    FLAGS: {
        CS: "Štítky",
        EN: "",
    },
}
export const TRANSLATION_LINKS = {

}
export const TRANSLATION_IMAGES = {}
