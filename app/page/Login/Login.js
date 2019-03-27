import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    InteractionManager,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Clipboard
} from 'react-native';
import {
    FB_USER_INFO,
    WX_AUTH,
} from '../../utils/Api';
const { width, height } = Dimensions.get('window');
import I18n from '../../config/i18n'
import NetUtils from '../../utils/NetUtils';
import * as Constant from '../../utils/Constant';
import Utils from '../../utils/Utils';
import {
} from '../../utils/Api';
import Storage from "../../utils/StorageUtils";
import BG from '../../res/images/signin_bg.png'
import LOGO from '../../res/images/login_logo.png'
import WE from '../../res/images/login_we.png'
import FACE from '../../res/images/login_face.png'
import EMAIL from '../../res/images/login_email.png'

import OText from '../../component/OText/OText';
import Button from '../../component/Button';
import ThirdLogin from '../../utils/ThirdLogin';
import NativeShare from "../../utils/NativeShare";
import LoadingView from '../../component/LoadingView/LoadingView';
import CommonToast from '../../component/CommonToast';

import { inject, observer } from "mobx-react/native";
import { Actions } from 'react-native-router-flux';


@inject(stores => ({
    user: stores.user,
    appSetting: stores.appSetting,
    homeStore: stores.homeStore,
    shopCartStore: stores.shopCartStore,
    shopStore: stores.shopStore,
    salesListStore: stores.salesListStore,
}))
@observer
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            platformWechat: false,
            platformFb: true,
        }
    }

    componentWillMount() {
        Storage.remove({
            key: Constant.USER_INFO
        });
        Storage.remove({
            key: Constant.HOME_CAT_DATA
        });
        Storage.remove({
            key: Constant.HOME_LIST_DATA
        });
        Storage.remove({
            key: Constant.SHOP_STORE_INFO
        });
        this.props.homeStore.resetHome();
        this.props.shopStore.resetShop();
        this.props.shopCartStore.resetCart();
        this.props.salesListStore.resetData();
        this.props.user.resetData();

        // NativeShare.asynSupportPlatform().then((result) => {
        //     this.setState({
        //         platformWechat: result.Support_WechatSession,
        //     })
        // }).catch((error) => {
        //     this.setState({
        //         platformWechat: false,
        //     })
        // });
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    timeoutHideLoading() {
        this.timer = setTimeout(() => {
            this.setState({ showLoading: false });
        }, 30000);// 跳转第三方APP后，手动返回，不能自动关闭菊花，所以过30秒自动
    }

    pressFace() {
        this.setState({ showLoading: true });
        this.timeoutHideLoading();
            // this.requestFacebookUserInfo('EAAQL1Aap7ZCwBAG1BnDWn7kKXo30rLQ3bjH7qq8N1tqRT9VfWMYxXSiV6MmnDLyOuMKsKmqpbvpFuSYTKULDLippdvmKo56FTvglFW7AcX6wD17pfNXMegQ1brPdaB9c5ZBH4TTGD9JySOh47vUEUZCuZAUkLJEwO8qEH9w1A9Q0BGnEnIb2MIbly1RLm0YMruuRb3dT1jEmsv7HCDUChTJx5wJzU0IZD');
        ThirdLogin.faceBookLogin().then((result) => {
            this.requestFacebookUserInfo(result.code);
        }).catch((error) => {
            this.refs.toast.show(error.message);
            this.setState({ showLoading: false });
        });
    }


    requestFacebookUserInfo(code) {
        this.setState({ showLoading: true });
        NetUtils.post(FB_USER_INFO, { code }, false).then((result) => {
            this.loginSuccess(result, '202');
        }).catch((error) => {
            this.refs.toast.show(error.msg);
            this.setState({ showLoading: false });
        });
    }

    pressWX() {
        this.setState({ showLoading: true });
        this.timeoutHideLoading();
        ThirdLogin.weChatLogin().then((result) => {
            this.requestWechatUserInfo(result.code);
        }).catch((error) => {
            if (error.code === '-999') {
                this.refs.toast.show(I18n('APP_INSTALL_WECHAT'));
            } else {
                this.refs.toast.show(error);
            }
            this.setState({ showLoading: false });
        });
    }

    requestWechatUserInfo(code) {
        let param = {
            code: code,
        }
        NetUtils.post(WX_AUTH, param, false).then((result) => {
            this.loginSuccess(result, '201');
        }).catch((error) => {
            this.loginFail(error);
        });
    }

    loginSuccess(result, code) {
        try {
            this.props.shopStore.getStoreInfo(() => {
                Actions.reset("HomePage");
            });
        } catch (error) {
        }

        //this.refs.toast.show();
    }


    pressMail() {
        Actions.push('EmailLogin')
    }

    render() {
        return (
            <View style={styles.bg}>
                {
                    this.state.showLoading ? (
                        <LoadingView cancel={() => this.setState({ showLoading: false })} />
                    ) : (null)
                }
                <View style={styles.logoView}>
                    <Image source={LOGO} style={styles.logoImage} />
                </View>
                <ImageBackground
                    source={BG}
                    style={styles.imageBg}
                >
                    <OText
                        text={'LOGIN.LOGIN_WELCOME'}
                        style={styles.titleText}
                    />
                    <OText
                        text={'LOGIN.LOGIN_THIRD'}
                        style={styles.detailText}
                    />
                    <View style={styles.bottomView}>
                        <Button
                            onPress={() => this.pressMail()}
                            style={styles.btnView}
                        >
                            <Image
                                style={styles.btnImg}
                                source={EMAIL}
                            />
                            <OText
                                text={'LOGIN.LOGIN_TYPE_EMAIL'}
                                style={styles.btnText}
                            />
                        </Button>
                    </View>
                </ImageBackground>
                <CommonToast ref="toast" />
            </View>
        );
    }

}


const styles = StyleSheet.create({
    bg: {
        height: '100%',
        width: '100%',
        flex: 1,
        backgroundColor: '#F4F4F4'
    },
    logoView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: Utils.scale(142),
        height: Utils.scale(46.4)
    },
    imageBg: {
        width: '100%',
        minHeight: Utils.scale(492),
        alignItems: "center",
        justifyContent: 'flex-end'
    },
    titleText: {
        fontSize: Utils.scaleFontSizeFunc(24),
        color: Constant.blackText,
        marginBottom: Utils.scale(14),
    },
    detailText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.grayText,
    },
    bottomView: {
        flexDirection: 'row',
        width: "80%",
        justifyContent: 'space-around'
    },
    btnView: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Utils.scale(36),
        marginTop: Utils.scale(39),
        width: Utils.scale(66),
    },
    btnImg: {
        width: Utils.scale(62),
        height: Utils.scale(62),
    },
    btnText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.grayText,
    }
});