import { action, computed, observable, runInAction, toJS } from "mobx";
import I18n, { changeLocale } from "../config/i18n";
import Storage from "../utils/StorageUtils";
import DeviceInformation from "../utils/DeviceInformation";

//是否测试包，可切换域名
export const FOR_TEST = false;

//测试
// export const BASE_URL_DEV = "http://weixin.oscart.weixin.zmrain.com";
// export const BASE_URL_US_TEST_NEW = "http://weixin.oscart.weixin.zmrain.com";
// export const BASE_URL_US = "http://weixin.oscart.weixin.zmrain.com";

export const BASE_URL_DEV = __DEV__ ? "http://mbeta-oscart.zmrain.com" : "https://m.oscart.com";
export const BASE_URL_US_TEST_NEW = __DEV__ ? "http://mbeta-oscart.zmrain.com" : "https://m.oscart.com";
export const BASE_URL_US = __DEV__ ? "http://mbeta-oscart.zmrain.com" : "https://m.oscart.com";

// export const BASE_URL_DEV = "http://mbeta-oscart.zmrain.com";
// export const BASE_URL_US_TEST_NEW = "http://mbeta-oscart.zmrain.com";
// export const BASE_URL_US = "http://mbeta-oscart.zmrain.com";

const kAppSettingURL = "kAppSettingURL"; // 保存站点URL
const kAppSettingLng = "kAppSettingLng"; // 保存语言

class AppSettingStore {

    @observable BaseUrl = BASE_URL_DEV;
    @observable countryList = [
        {
            title: I18n("countryUS"),
            isSelect: DeviceInformation.getDeviceCountry() !== "SG"
        },
        {
            title: I18n("countrySG"),
            isSelect: DeviceInformation.getDeviceCountry() === "SG"
        }
    ];

    @observable languageList = [
        { title: "简体中文", code: "zh_cn", isSelect: false },
        { title: "English", code: "en", isSelect: false }
    ];

    constructor() {
        // setTimeout(() => {
        //     this.setupBaseURL();
        //     this.setupLanguage();
        // }, 0);
    }

    setupBaseURL() {
        Storage.load({
            key: kAppSettingURL,

            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,

            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
            syncInBackground: true,

            // 你还可以给sync方法传递额外的参数
            syncParams: {
                extraFetchOptions: {
                    // 各种参数
                },
                someFlag: true
            }
        })
            .then(ret => {
                // 如果找到数据，则在then方法中返回
                // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                // 你只能在then这个方法内继续处理ret数据
                // 而不能在then以外处理
                // 也没有办法“变成”同步返回
                // 你也可以使用“看似”同步的async/await语法

                if (__DEV__) {
                    this.BaseUrl = BASE_URL_DEV;
                    return;
                }

                if (ret && ret + "" !== "") {
                    this.BaseUrl = ret;
                } else {
                    let country = DeviceInformation.getDeviceCountry();
                    if (
                        country.indexOf("SG") >= 0 ||
                        country.indexOf("新加坡") >= 0 ||
                        country.indexOf("Singapore") >= 0
                    ) {
                        this.BaseUrl =
                            FOR_TEST === false
                                ? BASE_URL_SG
                                : BASE_URL_SG_TEST_NEW;
                    } else {
                        this.BaseUrl =
                            FOR_TEST === false
                                ? BASE_URL_US
                                : BASE_URL_US_TEST_NEW;
                    }
                    this.saveBaseURL(this.BaseUrl);
                }
            })
            .catch(err => {
                //如果没有找到数据且没有sync方法，
                //或者有其他异常，则在catch中返回
                let country = DeviceInformation.getDeviceCountry();
                if (
                    country.indexOf("SG") >= 0 ||
                    country.indexOf("新加坡") >= 0 ||
                    country.indexOf("Singapore") >= 0
                ) {
                    this.BaseUrl =
                        FOR_TEST === false ? BASE_URL_SG : BASE_URL_SG_TEST_NEW;
                } else {
                    this.BaseUrl =
                        FOR_TEST === false ? BASE_URL_US : BASE_URL_US_TEST_NEW;
                }
                this.saveBaseURL(this.BaseUrl);
            });
    }

    @action
    setBaseURL(url) {
        this.BaseUrl = url;
        this.saveBaseURL(url);
    }

    saveBaseURL(url) {
        Storage.save({
            key: kAppSettingURL,
            data: toJS(url),
            expires: null
        });
    }

    setupLanguage() {
        Storage.load({
            key: kAppSettingLng,
            autoSync: true,
            syncInBackground: true
        })
            .then(ret => {
                if (ret && ret + "" != "") {
                    let code = ret;
                    let languageList = new Array().concat(
                        toJS(this.languageList)
                    );
                    for (const subLng of languageList) {
                        if (subLng.code + "" === code + "") {
                            subLng.isSelect = true;
                            break;
                        }
                    }
                    this.languageList = new Array().concat(languageList);
                    this.saveLanguage(code);
                } else {
                    this.setupLanguageError(111);
                }
            })
            .catch(err => {
                this.setupLanguageError(222);
            });
    }

    setupLanguageError(flag) {
        let language = DeviceInformation.getDeviceLocale();
        let code = "zh";
        if (language.indexOf("en") != -1) {
            code = "en";
        }

        let currentLanguage = this.languageList[0];
        for (let subLng of toJS(this.languageList)) {
            subLng.isSelect = false;
            if (subLng.code + "" === code) {
                subLng.isSelect = true;
                currentLanguage = subLng;
            }
        }
        this.saveLanguage(currentLanguage.code);
    }

    @action
    saveLanguage(code, callBack) {
        Storage.save({
            key: kAppSettingLng,
            data: toJS(code),
            expires: null
        });
        changeLocale(code);
        try {
            if (callBack) {
                callBack();
            }
        } catch (error) {
            console.log("========error===", error);
        }
    }

    @action
    setLanguageList(languageList, callBack) {
        runInAction(() => {
            this.languageList = languageList;
            for (let subLng of languageList) {
                if (subLng.isSelect) {
                    this.saveLanguage(subLng.code, callBack);
                }
            }
        });
    }

    @computed
    get getCurrentLanguage() {
        let currentLanguage = null;
        try {
            for (let subLanguage of toJS(this.languageList)) {
                if (subLanguage.isSelect) {
                    currentLanguage = subLanguage;
                }
            }
            if (!currentLanguage) {
                let language = DeviceInformation.getDeviceLocale();
                let code = "zh_cn";
                /**
                 * todo 合并时候改回去
                 */

                // if (language.indexOf("en") != -1) {
                //     code = "en";
                // } else if (language.indexOf("zh") > 0) {
                //     code = "zh_cn";
                // }

                let tempList = new Array().concat(toJS(this.languageList));
                for (let index in tempList) {
                    let subLng = tempList[index];
                    if (subLng.code + "" === "" + code) {
                        tempList[index].isSelect = true;
                        currentLanguage = subLng;
                    } else {
                        tempList[index].isSelect = false;
                    }
                }
                this.setLanguageList(tempList);
            }
        } catch (error) {
            currentLanguage = {
                title: "简体中文",
                code: "zh_cn",
                isSelect: true
            };
        }
        return currentLanguage;
    }

    // 暂时用不到的内容
    @action
    setCountryList(countryList) {
        this.countryList = countryList;
        this.saveCountryList(countryList);
    }

    saveCountryList(countryList) {
        Storage.save({
            key: kAppSetting,
            data: countryList,
            expires: null
        });
    }

    // getValue() {
    //     for (let tempObj of this.countryList) {
    //         if (tempObj.isSelect) {
    //             return tempObj
    //         }
    //     }
    // }

    @computed
    get getUrlLanguageCode() {
        let languageCode = this.getCurrentLanguage.code;
        let lang = "EN";
        if (languageCode === "zh_cn") {
            lang = "ZH";
        }
        return lang;
    }
}

export default new AppSettingStore();
