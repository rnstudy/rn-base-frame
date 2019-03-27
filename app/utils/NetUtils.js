import React, { Component } from "react";
import I18n from "../config/i18n";
import MD5 from "react-native-md5";
import Toast from "../component/Toast";
import { Platform, DeviceEventEmitter } from "react-native";
import { Actions } from "react-native-router-flux";
import AppSetting from "../store/AppSetting";
import Setting from "../page/Setting/Setting";
import Storage from "./StorageUtils";
import * as Constant from "./Constant";

/**
 * 网络请求的工具类
 */
export default class NetUtils extends Component {
    //构造函数，默认的props，以及state 都可以在这里初始化了
    constructor(props) {
        super(props);
    }

    /**
     * 普通的get请求
     * @param {*} url 地址
     * @param {*} params  参数
     */
    static get(url, params = {}, showToast = true, language) {
        let newParams = this.getNewParams(params, language);

        url = AppSetting.BaseUrl + url;
        let newUrl = url;
        if (newUrl.includes("?")) newUrl += "&";
        else newUrl += "?";

        for (let key in newParams) {
            newUrl = newUrl + key + "=" + newParams[key] + "&";
        }
        newUrl = newUrl.substr(0, newUrl.length - 1);
        __DEV__ && console.log("===getRequest===", newUrl);
        return new Promise((resolve, reject) => {
            fetch(newUrl, {
                credentials: "include",
                method: "GET"
            })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    __DEV__ && console.log("===getResponse===", newUrl, json);
                    if (json.code + '' === '0') {
                        resolve(json);
                    } else if (json.code === 404 || json.code === "404") {
                        showToast && Toast.show(json.msg);
                        reject({
                            code: json.code,
                            msg: json.msg,
                            data: json.data
                        });
                    } else if (
                        json.code + "" === "1023" ||
                        json.code + "" === "1022"
                    ) {
                        // 登录失效
                        DeviceEventEmitter.emit(Constant.LOGIN_FAIL);
                        reject({
                            code: json.code,
                            msg: json.msg,
                            data: json.data
                        });
                    } else {
                        showToast && Toast.show(json.msg);
                        reject({
                            code: json.code,
                            msg: json.msg,
                            data: json.data
                        });
                    }
                })
                .catch(error => {
                    __DEV__ && console.log("get======error", newUrl, error.toString());
                    showToast && Toast.show(I18n("NETWORK_ERROR"));
                    reject({ code: -11, msg: error.toString() });
                })
                .done();
        });
    }

    /**
     * 普通的get请求
     * @param {*} url 地址
     */
    static getForUrl(url) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                credentials: "include",
                method: "GET"
            })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => {
                    console.log(error.toString());
                    Toast.show(I18n("NETWORK_ERROR"));
                    reject(error.toString());
                })
                .done();
        });
    }

    /**
     * 普通的get请求
     * @param {*} url 地址
     * @param params
     */
    static getForUrl(url, params) {
        let newUrl = url + "?";
        for (let key in params) {
            newUrl = newUrl + key + "=" + params[key] + "&";
        }
        newUrl = newUrl.substr(0, newUrl.length - 1);
        return new Promise((resolve, reject) => {
            fetch(newUrl, {
                credentials: "include",
                method: "GET"
            })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => {
                    console.log(error.toString());
                    Toast.show(I18n("NETWORK_ERROR"));
                    reject(error.toString());
                })
                .done();
        });
    }

    /**
     * @param {*} url
     * @param {*} params
     * @param {*} callback
     */
    static post(url, params = {}, showToast = true) {
        //添加公共参数
        const newParams = this.getNewParams(params);

        let formData = new FormData();
        for (let key in newParams) {
            formData.append(key, newParams[key]);
        }
        url = AppSetting.BaseUrl + url;
        __DEV__ && console.log("===post=url", url, formData);
        return new Promise((resolve, reject) => {
            fetch(url, {
                credentials: "include",
                method: "POST",
                body: formData
            })
                .then(response => {
                    if(response.status !== 200){
                        console.log("===post=response ", response);
                    }
                    return response.json();
                })
                .then(json => {
                    __DEV__ && console.log("===post=json ", url, json);
                    if (json.code === 0 || json.code === "0") {
                        resolve(json);
                    } else if (json.code === 404 || json.code === "404") {
                        showToast && Toast.show(json.msg);
                        reject({ code: json.code, msg: json.msg });
                    } else if (
                        json.code + "" === "1023" ||
                        json.code + "" === "1022"
                    ) {
                        // 登录失效
                        DeviceEventEmitter.emit(Constant.LOGIN_FAIL);
                        reject({ code: json.code, msg: json.msg });
                    } else if (
                        json.code + "" === "9002"
                    ) {
                        reject({ code: json.code, msg: json.msg });
                    } else {
                        showToast && Toast.show(json.msg);
                        reject({ code: json.code, msg: json.msg });
                    }
                })
                .catch(error => {
                    __DEV__ &&
                        console.log("===post error=", url, formData, error);
                    let msg = I18n("NETWORK_ERROR");
                    showToast && Toast.show(msg);
                    reject({ code: -11, msg: msg });
                })
                .done();
        });
    }

    loginExpire() {
        // 登录失效
        __DEV__ && console.log("Login Fail!!!!");
        //alert('退出登录');
        Storage.remove({
            key: Constant.USER_INFO
        });
        Storage.remove({
            key: Constant.HOME_CAT_DATA
        });
        Storage.remove({
            key: Constant.HOME_LIST_DATA
        });

        Actions.reset("Login");
    }

    /**
     * @param {*} url
     * @param {*} service
     * @param {*} jsonObj
     */
    static postJson(url, jsonObj) {
        url = AppSetting.BaseUrl + url;
        console.log(url);
        console.log(jsonObj);
        return new Promise((resolve, reject) => {
            fetch(url, {
                credentials: "include",
                method: "POST",
                body: JSON.stringify(jsonObj),
                headers: { "Content-Type": "application/json" }
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then(json => {
                    console.log(json);
                    resolve(json);
                })
                .catch(error => {
                    console.log(error.toString());
                    Toast.show(I18n("NETWORK_ERROR"));
                    reject(error.toString());
                })
                .done();
        });
    }

    /**
     * 获取当前系统时间 yyyyMMddHHmmss
     */
    static getCurrentDate() {
        var space = "";
        var dates = new Date();
        var years = dates.getFullYear();
        var months = dates.getMonth() + 1;
        if (months < 10) {
            months = "0" + months;
        }

        var days = dates.getDate();
        if (days < 10) {
            days = "0" + days;
        }

        var hours = dates.getHours();
        if (hours < 10) {
            hours = "0" + hours;
        }

        var mins = dates.getMinutes();
        if (mins < 10) {
            mins = "0" + mins;
        }

        var secs = dates.getSeconds();
        if (secs < 10) {
            secs = "0" + secs;
        }
        var time =
            years +
            space +
            months +
            space +
            days +
            space +
            hours +
            space +
            mins +
            space +
            secs;
        return time;
    }

    /**
     * 设置公共参数
     * @param {*} params 参数 key-value形式的字符串
     * @return 新的参数
     */
    static getNewParams(params, language) {
        params.platform = Platform.OS;
        let lan = "EN";
        if (language) {
            lan = language;
        } else {
            try {
                switch (AppSetting.getCurrentLanguage.code) {
                    case "zh_cn":
                        lan = "ZH";
                        break;
                    default:
                        break;
                }
            } catch (error) { }
        }
        params.languageType = lan;
        return params;
    }

    /**
     * 字符串加密
     * @param {*} str
     */
    static MD5(str) {
        return MD5.hex_md5(str);
    }

    /**
     * 获取当前系统时间 yyyyMMddHH
     */
    static getCurrentDateFormat() {
        var space = "";
        var dates = new Date();
        var years = dates.getFullYear();
        var months = dates.getMonth() + 1;
        if (months < 10) {
            months = "0" + months;
        }

        var days = dates.getDate();
        if (days < 10) {
            days = "0" + days;
        }
        var time = years + space + months + space + days;
        return time;
    }
}
