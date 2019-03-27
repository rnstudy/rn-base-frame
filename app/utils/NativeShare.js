import {
    NativeModules, Platform,
} from 'react-native';


export default class NativeShare {


    static getSupportPlatform() {
        let NativeShare = null;
        if (Platform.OS === 'ios') {
            NativeShare = NativeModules.OCShare
        } else {
            NativeShare = NativeModules.AndroidShare
        }
        return {
            wechat: NativeShare.Support_WechatSession,
            facebook: NativeShare.Support_Facebook,
            messenger: NativeShare.Support_FaceBookMessenger
        }
    }

    static asynSupportPlatform() {
        if (Platform.OS === 'ios') {
            return NativeModules.OCShare.supportPlatforms();
        } else {
            return NativeModules.AndroidShare.supportPlatforms();
        }
    }

    static WEIXIN = "WEIXIN";
    static WEIXIN_CIRCLE = "WEIXIN_CIRCLE";
    static FACEBOOK = "FACEBOOK";
    static FACEBOOK_MESSAGER = "FACEBOOK_MESSAGER";

    /**
     * 直接分享到平台
     * @param title             标题
     * @param desc              描述
     * @param imageUrl          图片
     * @param link              连接
     * @param platform          平台
                                WEIXIN = "WEIXIN";
                                WEIXIN_TIMELINE = "WEIXIN_TIMELINE";
                                FACEBOOK = "FACEBOOK";
                                FACEBOOK_MESSAGER = "FACEBOOK_MESSAGER";
     * 
     * @return {Promise.<*>}    回调
     * 
     * 
     * 
    NativeShare.shareNoBoard(
            '标题',
            '描述',
            'https://img3.chouti.com/CHOUTI_20180628/6A33DA3122B84F0B936AE683EC1EF8AE_W201H201=C120x120.jpg?quality=80',
            'https://us.vip.com/',
            "FACEBOOK"
        );
     */
    static shareNoBoard(title = '标题', desc = '描述', imageUrl = null, link = 'https://us.vip.com/', platform) {
        if (Platform.OS === 'ios') {
            return NativeModules.OCShare.shareNoBoard(title, desc, imageUrl, link, platform);
        }
        return NativeModules.AndroidShare.shareNoBoard(title, desc, imageUrl, link, platform);
    }
}


