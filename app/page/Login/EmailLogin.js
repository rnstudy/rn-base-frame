import React, { Component } from "react";
import I18n from "../../config/i18n";
import NetUtils from "../../utils/NetUtils";
import LoadingView from "../../component/LoadingView/LoadingView";
import Storage from "../../utils/StorageUtils";
import * as Constant from "../../utils/Constant";
import MyImage from '../../component/SVG/MyImage';
import {
    SIGNIN,
    SIGNUP,
    VERIFICATION_CODE,
} from '../../utils/Api';
import { KeyboardAwareScrollView } from "../../component/KeyboardAwareScrollView";
import OText from "../../component/OText/OText";
import {
    Dimensions,
    InteractionManager,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { Actions } from "react-native-router-flux";
import Toast from "../../component/GoodsDetailModal/Toast";
import OTextInput from "../../component/OTextInput/OTextInput";
import Button from "../../component/Button";
import Utils from "../../utils/Utils";
import { inject, observer } from "mobx-react/native";

const { width, height } = Dimensions.get("window");

@inject(stores => ({
    appSetting: stores.appSetting,
    shopStore: stores.shopStore
}))
@observer
export default class EmailLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            isSigninType: true,
            accontTxt: "",
            pwTxt: "",
            itemData: null,
            codeImg: null,
            platformWechat: false,
            modalVisible: false
        };
    }

    componentWillMount() {
        this.getVerifyCode()
    }

    componentDidMount() { }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    getVerifyCode() {
        let type = 1;//登陆
        if (!this.state.isSigninType) {
            type = 2;
        }
        NetUtils.get(VERIFICATION_CODE, { type }).then((result) => {
            this.setState({
                codeImg: result.data.img,
                showLoading: false,
            })
        }).catch(e => {
            this.setState({
                showLoading: false
            })
        })
    }

    renderCode() {
        return (
            <View style={{ flexDirection: 'row' }}>
                {/* 验证码 */}
                <OTextInput
                    ref='codeTextInput'
                    layoutStyle={{ marginTop: 20, flex: 1 }}
                    placeholder={I18n('LOGIN.CONFIRM_VERIFICATION_CODE')}
                    placeholderTextColor='#333333'
                    bottomLineColor='#E5E5E5'
                    returnKeyType='done'
                    onChangeText={(text) => {
                        this.refs.codeTextInput.setErrorText("");
                        this.setState({ verifyCode: text })
                    }}
                    onSubmitEditing={() => {
                        this.onSigninPress()
                    }}
                />
                <TouchableOpacity
                    style={{ width: '100%', flex: 1 }}
                    onPress={() => this.getVerifyCode()}
                >
                    <View>
                        {
                            this.state.codeImg == null ?
                                <View style={{ width: '100%', height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>{I18n('LOGIN.CONFIRM_VERIFICATION_REGET')}</Text>
                                </View> :
                                <MyImage
                                    source={{
                                        uri: `data:image/svg+xml;utf8,` + this.state.codeImg
                                    }}
                                    style={{ width: '100%', flex: 1 }}
                                />
                        }
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * 渲染方法
     * */
    render() {
        return (
            <View
                style={{
                    height: "100%",
                    width: "100%",
                    flex: 1,
                    backgroundColor: "#fff"
                }}
            >
                {this.state.showLoading ? (
                    <LoadingView
                        cancel={() => this.setState({ showLoading: false })}
                    />
                ) : null}
                <KeyboardAwareScrollView
                    style={{
                        height: "100%",
                        width: "100%",
                        flex: 1,
                        backgroundColor: "#fff"
                    }}
                >
                    <View
                        style={{
                            height:
                                Platform.OS === "ios"
                                    ? Constant.iphoneStatusbarHeight
                                    : 0
                        }}
                    />
                    <View style={{ flex: 1, marginLeft: 36, marginRight: 36 }}>
                        {this.renderHeader()}

                        {/* 输入框 */}
                        {this.renderLoginInput()}

                        {/*验证码 */}
                        {this.state.isSigninType && this.renderCode()}

                        {/* 登录/注册 按钮 */}
                        {this.renderButton()}

                        {/* 忘记密码 */}
                        {this.renderForgotPasssword()}

                        {/* 切换登录页/注册页 */}
                        {this.renderChangePage()}
                    </View>
                </KeyboardAwareScrollView>
                <Toast ref="toast" />
            </View>
        );
    }

    renderHeader() {
        let text = this.state.isSigninType ? "LOGIN.LOGIN_LOGIN" : "LOGIN.REGISTER_REGISTER";
        return <OText text={text} style={styles.titleText} />;
    }

    onPressImage() {
        if (FOR_TEST) {
            this.refs.picker.open();
        }
    }

    renderLoginInput() {
        return (
            <View>
                {/* 用户名 */}
                <OTextInput
                    layoutStyle={{
                        marginTop: Utils.scale(35),
                        marginBottom: Utils.scale(35)
                    }}
                    ref="accountTextInput"
                    keyboardType="email-address"
                    placeholder={I18n("LOGIN.LOGIN_EMAIL")}
                    placeholderTextColor="#333333"
                    bottomLineColor="#E5E5E5"
                    returnKeyType="next"
                    onChangeText={text => {
                        this.refs.accountTextInput.setErrorText("");
                        this.setState({ accontTxt: text });
                    }}
                    onSubmitEditing={() => {
                        this.refs.pwTextInput.setFocus();
                    }}
                />

                {/* 密码 */}
                <OTextInput
                    ref="pwTextInput"
                    isPassword={true}
                    placeholder={I18n("LOGIN.LOGIN_PASSWORD")}
                    placeholderTextColor="#333333"
                    bottomLineColor="#E5E5E5"
                    maxLength={20}
                    returnKeyType="next"
                    onChangeText={text => {
                        this.refs.pwTextInput.setErrorText("");
                        this.setState({ pwTxt: text });
                    }}
                    onSubmitEditing={() => {
                        this.onSigninPress();
                    }}
                />
            </View>
        );
    }

    // 注册/登录
    renderButton() {
        return (
            <Button
                onPress={() => this.onSigninPress()}
                style={styles.signinBtnLayout}
            >
                <Text style={styles.signinBtnTxt}>
                    {this.state.isSigninType
                        ? I18n("ACCOUNT_LOGIN")
                        : I18n("LOGIN.REGISTER_REGISTER")}
                </Text>
            </Button>
        );
    }

    renderForgotPasssword() {
        if (this.state.isSigninType) {
            return (
                <View>
                    <Text
                        style={styles.forgetpwTxt}
                        onPress={() => this.forgetPassword()}
                    >
                        {I18n("LOGIN.LOGIN_FORGET_PASSWORD")}
                    </Text>
                    {this.state.isSigninType ? (
                        <View
                            style={{
                                marginTop: 24,
                                flexDirection: "row",
                                justifyContent: "center"
                            }}
                        />
                    ) : null}
                </View>
            );
        } else {
            return <View style={{
                marginTop: 24,
                height: 22,
            }}></View>
        }

    }

    renderChangePage() {
        let text1 = this.state.isSigninType
            ? "LOGIN.LOGIN_SIGN_UP1"
            : "LOGIN.REGISTER_LOGIN1";
        let text2 = this.state.isSigninType
            ? "LOGIN.LOGIN_SIGN_UP2"
            : "LOGIN.REGISTER_LOGIN2";
        return (
            <TouchableOpacity
                onPress={() => this.changeIsSignin()}
                style={{
                    marginBottom: Constant.iphoneBottomSpace + 27,
                    flexDirection: "row",
                    justifyContent: "center"
                }}
            >
                <OText
                    style={{
                        fontSize: Utils.scaleFontSizeFunc(14),
                        color: "#333"
                    }}
                    text={text1}
                >
                    <OText
                        style={{
                            color: Constant.themeText,
                            fontWeight: "bold"
                        }}
                        text={text2}
                    />
                </OText>
            </TouchableOpacity>
        );
    }

    changeIsSignin() {
        this.setState({
            isSigninType: !this.state.isSigninType
        });
    }

    /**
     * 点击登录方法
     * */
    onSigninPress() {
        if (this.state.accontTxt + "" === "") {
            this.refs.accountTextInput.setErrorText(
                I18n("LOGIN.INPUT_STORE_EMAIL_TIP2")
            );
            return;
        }

        if (!Utils.checkEmail(this.state.accontTxt)) {
            this.refs.accountTextInput.setErrorText(
                I18n("LOGIN.FORGOTPASSWORD_ERROR_TIP")
            );
            return;
        }

        if (this.state.pwTxt.length + "" === "") {
            this.refs.pwTextInput.setErrorText(
                I18n("LOGIN.CHANGE_PASSWORD_INPUT")
            );
            return;
        } else if (this.state.pwTxt.length < 6 || this.state.pwTxt.length > 16) {
            this.refs.pwTextInput.setErrorText(
                I18n("LOGIN.CHANGE_PASSWORD_INPUT_LENGTH")
            );
            return;
        } else if (!Utils.isPassword(this.state.pwTxt)) {
            this.refs.pwTextInput.setErrorText(
                I18n("LOGIN.TEXT_PASSWORD_INVALID")
            );
            return;
        }

        //  关闭软键盘
        TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
        try {
            //注册
            if (!this.state.isSigninType) {
                let para = {
                    email: this.state.accontTxt,
                    passwd: Utils.bcrypt(this.state.pwTxt)
                };
                this.setState({ showLoading: true });
                NetUtils.post(SIGNUP, para)
                    .then(result => {
                        this.setState({ showLoading: false });
                        if (result.code === 0) {
                            let itemData = {
                                email: this.state.accontTxt,
                                type: 1,
                                passwd: this.state.pwTxt
                            };
                            Actions.push("Verification", {
                                itemData: itemData
                            });
                        }
                    })
                    .catch(error => {
                        this.setState({ showLoading: false });
                        if (error.code + "" === "2001") {
                            this.refs.accountTextInput.setErrorText(error.msg);
                        } else {
                            this.refs.codeTextInput.setErrorText(error.msg);
                        }
                    });
            } else {
                //登录
                let para = {
                    email: this.state.accontTxt,
                    passwd: Utils.bcrypt(this.state.pwTxt),
                    verification: this.state.verifyCode,
                };
                this.setState({ showLoading: true });
                NetUtils.post(SIGNIN, para, false)
                    .then(result => {
                        this.setState({ showLoading: false });
                        this.loginSuccess(result, "200");
                    })
                    .catch(error => {
                        this.setState({ showLoading: false });
                        this.loginFail(error);
                    });
            }
        } catch (error) {
            console.log("----", error);
        }
    }

    loginSuccess(result, loginType) {
        this.setState({ showLoading: false });
        const { store } = result.data
        Storage.save({
            key: Constant.USER_INFO,
            data: result.data,
            expires: null
        });
        Storage.save({
            key: Constant.LOGIN_TYPE,
            data: loginType,
            expires: null
        });
        if (store) {
            this.props.shopStore.setShopInfo(store);
            global.userInfo = result.data;
            InteractionManager.runAfterInteractions(() => {
                Actions.reset("HomePage");
            });
        } else {
            Actions.reset("ApplyPartner");
        }
    }

    loginFail(error) {
        if (error.code + "" === "2009") {
            this.refs.pwTextInput.setErrorText(error.msg);
        } else {
            this.refs.codeTextInput.setErrorText(error.msg);
        }
        this.getVerifyCode()
    }

    /**
     * 忘记密码
     * */
    forgetPassword() {
        Actions.push("ForgotPassword");
    }
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: Utils.scaleFontSizeFunc(32),
        color: Constant.blackText,
        paddingTop: Utils.scale(50)
    },

    loginTitle: {
        marginTop: 16,
        fontSize: 25,
        fontWeight: "300",
        color: "#333",
        backgroundColor: "#0000"
    },

    maskLayout: {
        backgroundColor: "#000C",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },

    signinTitle: {
        marginTop: 32,
        marginBottom: 32,
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        backgroundColor: "#0000"
    },

    signinBtnLayout: {
        height: Utils.scale(54),
        backgroundColor: Constant.bottomBtnBg,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Utils.scale(27),
        marginTop: Utils.scale(20)
    },

    signinBtnTxt: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: "#fff",
        fontWeight: "bold"
    },

    forgetpwTxt: {
        textAlign: "center",
        marginTop: 24,
        fontSize: 14,
        height: 22,
        color: "#333",
        backgroundColor: "#0000",
        textDecorationLine: "underline"
    }
});
