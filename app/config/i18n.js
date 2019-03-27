import { NativeModules } from 'react-native';
import I18n from 'react-native-i18n'
import EN from '../language/en.json'
import ZH_CN from '../language/zh.json'

const { RNI18n } = NativeModules;


I18n.fallbacks = true;

I18n.defaultLocale = "zh-CN";

I18n.translations = {
    'en': EN,
    'zh-CN': ZH_CN
};

export const changeLocale = function (multilingual) {
    //debugger;
    if (multilingual === 'local' || !multilingual) {
        if (__DEV__) {
            if (RNI18n !== undefined && typeof RNI18n !== 'undefined') {
                console.log("language system", RNI18n.languages[0])
            }
        }
        I18n.locale = (RNI18n !== undefined && typeof RNI18n !== 'undefined') ? RNI18n.languages[0].replace(/_/, '-') : ''
    } else {
        I18n.locale = multilingual
    }
    // for ios
    if (I18n.locale.indexOf('zh-Hans') !== -1) {
        I18n.locale = 'zh-CN'
    } else if (I18n.locale.indexOf('zh-Hant') !== -1 || I18n.locale === 'zh-HK' || I18n.locale === 'zh-MO') {
        I18n.locale = 'zh-CN'
    }


};

export default function (name, option1, option2) {
    return I18n.t(name, option1, option2)
}

export const priceTranslations = function (price) {
    let temp = 0
    try {
        let temp = parseFloat(price)
    } catch (error) { }
    return I18n.l("currency", temp);
}