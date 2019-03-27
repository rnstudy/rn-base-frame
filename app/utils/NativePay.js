import {NativeModules, Platform,} from 'react-native';

export default class NativePay {
    /**
     * 微信pay
     */
    static weChatPay(wechatData) {
        console.log("weChatPay", wechatData)
        if (Platform.OS === 'ios') {
            return NativeModules.OCNativeModule.wxPayWithParameters(wechatData);
        }
        return NativeModules.AndroidPay.wechatPay(JSON.stringify(wechatData));
    }
}


