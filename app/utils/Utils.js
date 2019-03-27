import { Actions } from "react-native-router-flux";
import I18n from "../config/i18n";
//import bcrypt from "react-native-bcrypt";
// import isaac from "isaac";
// import bcrypt2 from "bcrypt";
// import bcrypt3 from 'bcryptjs'

/**
 * 全局常量
 */
// UI设计以iPhone6宽度为标准模板 () 6p:414
import { Dimensions, Platform } from "react-native";
import head from "../res/images/default_head.png";
import AppSetting from "../store/AppSetting";
const UI_STANDARD = 375;

export default class Utils {
    /**
     * 屏幕比例换算
     * @param {*} width
     */
    static scale(width) {
        return (Dimensions.get("window").width / UI_STANDARD) * width;
    }

    static isIOS() {
        return Platform.OS === "ios";
    }

    /**
     * 字体换算
     * @param {*} size
     */
    static scaleFontSizeFunc(size) {
        if (Platform.OS === "ios" && Dimensions.get("window").width === 320) {
            //iphone 5s
            return size - 1;
        }
        return size;
    }

    static orderStatus(orderType, orderStatus, groupStatus) {
        if (orderType === 1) {
            switch (orderStatus) {
                case 1:
                    return I18n("orderStatus11");
                case 2:
                    return I18n("orderStatus12");
                case 3:
                    return I18n("orderStatus13");
                case 4:
                    return I18n("orderStatus14");
                case 5:
                    return I18n("orderStatus15");
            }
        } else {
            if (orderStatus === 1) {
                switch (groupStatus) {
                    case 1:
                        return I18n("orderStatus211");
                    case 2:
                        return I18n("orderStatus212");
                    case 3:
                        return I18n("orderStatus213");
                    case 4:
                        return I18n("orderStatus214");
                }
            } else if (orderStatus === 2) {
                return I18n("orderStatus22");
            } else if (orderStatus === 3) {
                return I18n("orderStatus23");
            } else if (orderStatus === 4) {
                switch (groupStatus) {
                    case 1:
                        return I18n("orderStatus241");
                    case 2:
                        return I18n("orderStatus242");
                    case 3:
                        return I18n("orderStatus243");
                    case 4:
                        return I18n("orderStatus244");
                }
            } else {
                return I18n("orderStatus25");
            }
        }
    }

    static checkEmail(email) {
        let myReg = /^[a-zA-Z0-9_\.-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org|site|online|live|co|in|global|me|biz|news|link|email|work|website|shop|world|io|info|club|store|tech|xyz|social|us|pub|desi|)$/;

        return myReg.test(email);
    }

    static isPhoneUs(str){
        return str.replace(/[^\d]/g, "").length === 10;
    }

    /**
     * 密码加密
     * @param pwTxt
     */
    static bcrypt(pwTxt) {
        return pwTxt;
    }

    static setGoodsDetailShareData(
        storeInfo,
        itemData,
        baseUrl,
        code = "zh_cn",
        unit
    ) {
        try {
            const {
                recommend,
                photo,
                skuName,
                sellPrice,
                marketPrice,
                sku,
                freePrice
            } = itemData;
            if (!photo) {
                photo = head;
            }
            const { storeId, storeName, headImgUrl } = storeInfo;
            let headImg = headImgUrl;
            if (headImgUrl + "" === "") {
                headImg = head;
            }
            let lan = "EN";
            switch (code) {
                case "zh_cn":
                    lan = "ZH";
                    break;
                default:
                    break;
            }
            let link = "/detail/" + storeId + "/" + sku + "/" + lan,
                desc = I18n("SHARE.TEXT_SHARE_RECOMMAND"),
                pilicy = [
                    I18n("COMMON.TEXT_GENUINE_GUARANTEE"),
                    I18n("COMMON.TEXT_FREE_SHIPPING", {
                        unit: unit,
                        value: freePrice || ""
                    }),
                    I18n("COMMON.TEXT_FREE_RETURN")
                ];

            return {
                desc,
                recommend,
                imageUrl: photo,
                link,
                skuName,
                marketPrice: unit + marketPrice,
                sellPrice: unit + sellPrice,
                storeName,
                headImg,
                pilicy
            };
        } catch (error) {}
    }

    static setShareData(storeInfo, itemData, baseUrl, code, unit = "$") {
        const {
            sellPrice,
            photo,
            recommend,
            sku,
            commission,
            skuName,
            freePrice,
            marketPrice
        } = itemData;
        const { storeId, storeName, headImgUrl } = storeInfo;
        let headImg = headImgUrl;
        if (headImgUrl + "" === "") {
            headImg = head;
        }
        let lan = "EN";
        switch (code) {
            case "zh_cn":
                lan = "ZH";
                break;
            default:
                break;
        }
        let link = baseUrl + "/detail/" + storeId + "/" + sku + "/" + lan;

        let title = I18n("PRODUCTION_SHARE_TITLE", {
            unit: unit,
            sellPrice: sellPrice,
            productName: recommend
        });
        let desc = I18n("PRODUCTION_SHARE_DESC", {
            storeName
        });
        let pilicy = [
            I18n("COMMON.TEXT_GENUINE_GUARANTEE"),
            I18n("COMMON.TEXT_FREE_SHIPPING", {
                unit: unit,
                value: freePrice || ""
            }),
            I18n("COMMON.TEXT_FREE_RETURN")
        ];
        return {
            title,
            desc,
            imageUrl: photo,
            link,
            commissionText: unit + commission,
            shareName: recommend,
            marketPrice: marketPrice > 0 ? unit + marketPrice : null,
            sellPrice: unit + sellPrice,
            storeName,
            headImg,
            skuName,
            pilicy
        };
    }

    static setShareCollectionData(storeInfo, itemData, baseUrl, code) {
        const {
            collectionName,
            productPic,
            collectionId,
            unit,
            freePrice
        } = itemData;
        const { storeId, storeName, headImgUrl } = storeInfo;
        let headImg = headImgUrl;
        if (headImgUrl + "" === "") {
            headImg =
                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553693469657&di=5d954674694de5c2d8bbab181287f4f9&imgtype=0&src=http%3A%2F%2Fpic2.zhimg.com%2F50%2Fv2-b6a750f487ddbf996fc516f1e82445fb_b.jpg";
        }
        let lan = "EN";
        switch (code) {
            case "zh_cn":
                lan = "ZH";
                break;
            default:
                break;
        }
        let link =
            baseUrl + "/collection/" + storeId + "/" + collectionId + "/" + lan;
        let defaultTip = I18n("SHARE.TEXT_SHARE_RECOMMAND"),
            pilicy = [
                I18n("COMMON.TEXT_GENUINE_GUARANTEE"),
                I18n("COMMON.TEXT_FREE_SHIPPING", {
                    unit: freePrice ? unit : "",
                    value: freePrice || ""
                }),
                I18n("COMMON.TEXT_FREE_RETURN")
            ];
        return {
            defaultTip,
            imageUrlList: productPic,
            link,
            storeName,
            headImg,
            collectionName,
            collectionId,
            pilicy
        };
    }

    static setShareStore(storename, imageUrl, link) {
        let title = I18n("STORE_SALE_LIST_SHARE_TITLE", {
            storename: storename
        });
        let desc = I18n("STORE_SALE_LIST_SHARE_DESC");
        return {
            title,
            desc,
            imageUrl,
            link
        };
    }

    //去左右空格;
    static trim(s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    }

    static getPhoneNum(str){
        return str.replace(/[^\d]/g, "");
    }

    static formatPhoneChange(text) {
        if(text){
            text = this.trim(text);
            if(text.length === 3 || text.length === 7){
                text+='-';
            }
            return text;
        }else{
            return "";
        }
    }

    static formatPhoneUs(text){
        let phone = this.getPhoneNum(text);
        let len = phone.length;
        if(len === 10){
            return "1-" + this.formatPhone(text)
        }else{
            return this.formatPhone(text)
        }
    }

    static formatPhone(text) {
        if(text){
            let arr = text.split('');
            let str = '';
            arr.forEach(function(val, ind) {
                if (ind === 3 || ind === 6) {
                    str += '-'
                }
                str += val
            })
            return str;
        }else{
            return "";
        }
    }

    // 包含中文
    static isContainChinese(text) {
        let reg = /[\u4e00-\u9fa5]/g;
        return reg.test(text);
    }

    //,./<>?;:’”[]{}\-_+=~`!@#$%^&*()
    static isAddress(text) {
        let reg = /[^\a-\z\A-\Z0-9\@\.]/g;
        return reg.test(text);
    }

    static isPassword(text) {
        let reg = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
        return reg.test(text);
    }

    static transformTime(remainSecond) {
        const day = parseInt(remainSecond / (24 * 3600));
        const dayStr = this.autoCompleNumber(day);
        // 小时
        remainSecond = parseInt(remainSecond % (24 * 3600));
        const hour = parseInt(remainSecond / 3600);
        const hourStr = this.autoCompleNumber(hour);
        // 分钟
        remainSecond = parseInt(remainSecond % 3600);
        const minute = parseInt(remainSecond / 60);
        const minuteStr = this.autoCompleNumber(minute); //minute < 10 ? '0' + minute : '' + minute;
        // 秒
        remainSecond = parseInt(remainSecond % 60);
        const secondStr = this.autoCompleNumber(remainSecond);
        return {
            DD: dayStr,
            HH: hourStr,
            MM: minuteStr,
            SS: secondStr
        };
    }

    static autoCompleNumber(num) {
        if (isNaN(num) || num === "" || num === " ") {
            return "00";
        } else {
            if (parseInt(num) < 10 && parseInt(num) > -1) {
                return "0" + num;
            } else {
                return "" + num;
            }
        }
    }

    static switchWalletSourceType(type) {
        switch (type) {
            case 1:
                return I18n("WALLET.COMMISSION_TYPE1");
                break;
            case 2:
                return I18n("WALLET.COMMISSION_TYPE2");
                break;
            case 3:
                return I18n("WALLET.COMMISSION_TYPE3");
                break;
            case 4:
                return I18n("WALLET.COMMISSION_TYPE4");
                break;
            case 5:
                return I18n("WALLET.COMMISSION_TYPE5");
                break;
            case 6:
                return I18n("WALLET.COMMISSION_TYPE6");
                break;
            case 7:
                return I18n("WALLET.COMMISSION_TYPE7");
                break;
            case 8:
                return I18n("WALLET.COMMISSION_TYPE8");
                break;
            case 9:
                return I18n("WALLET.COMMISSION_TYPE9");
                break;
            case 10:
                return I18n("WALLET.COMMISSION_TYPE10");
                break;
            case 11:
                return I18n("WALLET.COMMISSION_TYPE11");
                break;
            case 12:
                return I18n("WALLET.COMMISSION_TYPE12");
                break;
            case 13:
                return I18n("WALLET.COMMISSION_TYPE13");
                break;
            case 14:
                return I18n("WALLET.COMMISSION_TYPE14");
                break;
            case 15:
                return I18n("WALLET.COMMISSION_TYPE15");
                break;
            case 16:
                return I18n("WALLET.COMMISSION_TYPE16");
                break;
            case 17:
                return I18n("WALLET.COMMISSION_TYPE17");
                break;
            case 18:
                return I18n("WALLET.COMMISSION_TYPE18");
            default:
                break;
        }
    }
}
