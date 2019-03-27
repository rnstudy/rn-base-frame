import {
    NativeModules, Platform,
} from 'react-native';

export default class ThirdLogin {
    /**
     * 微信登陆
     */
    static weChatLogin() {
        if (Platform.OS === 'ios') {
            return NativeModules.OCNativeModule.wechatLogin();
        }
        return NativeModules.AndroidLogin.weChatLogin();
    }

    static faceBookLogin() {
        console.log("faceBookLogin")
        if (Platform.OS === 'ios') {
            return NativeModules.OCNativeModule.facebookLogin();
        }
        return NativeModules.AndroidLogin.faceBookLogin();
    }
}


