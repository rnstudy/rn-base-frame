import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, NativeModules, Platform } from 'react-native';
import I18n from '../../config/i18n'
import Screen from "../../utils/Screen";
import OTextInput from "../../component/OTextInput/OTextInput";
import NetUtils from "../../utils/NetUtils";
import { FORGET_PASSWD, VERIFICATION_CODE } from "../../utils/Api";
import { Actions } from "react-native-router-flux";
import Utils from '../../utils/Utils'
import LoadingView from '../../component/LoadingView/LoadingView';
import * as Constant from "../../utils/Constant"
import CommonHeader, { NAVIGATION_BACK } from '../../component/Header/CommonHeader';
import OText from '../../component/OText/OText';

export default class ForgotPasswordPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            verifyCode: '',
            itemData: null,
            codeImg: null,
        };
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    onPressSend() {
        const { emailTxt } = this.state;
        if (emailTxt + '' === '') {
            this.refs.accountTextInput.setErrorText(I18n('LOGIN.FORGOTPASSWORD_TIP'))
            return;
        }

        if (!Utils.checkEmail(emailTxt)) {
            this.refs.accountTextInput.setErrorText(I18n('LOGIN.TEXT_RESET_PASSWORD_TIP'))
            return;
        }

        this.setState({ showLoading: true });
        let param = {
            email: emailTxt,
        };

        NetUtils.post(FORGET_PASSWD, param).then((result) => {
            this.setState({ showLoading: false });
            if (result.code === 0) {
                Actions.push('Verification', {
                    itemData: {
                        email: emailTxt,
                        type: 2,
                    }
                });
                return;
            }
        }).catch((error) => {
            this.setState({ showLoading: false });
            if (error.code + '' === '2007') {
                this.refs.accountTextInput.setErrorText(error.msg);
            } else {
                this.refs.codeTextInput.setErrorText(error.msg);
            }
        });
    }

    onTextChange(text) {
        this.refs.accountTextInput.setErrorText('');
        this.state.emailTxt = text;
    }

    render() {
        return (
            <CommonHeader
                showDivider={false}
                titleType={NAVIGATION_BACK}
                title={''}
            >
                <View style={styles.viewStyle}>
                    {
                        this.state.showLoading ? (
                            <LoadingView cancel={() => this.setState({ showLoading: false })} />
                        ) : (null)
                    }
                    <OText
                        style={styles.forgetTitle}
                        text={'LOGIN.TEXT_RESET_PASSWORD'}
                    />
                    <OText
                        style={styles.forgotText}
                        text={'LOGIN.FORGOTPASSWORD_TEXT'}
                    />

                    <View style={styles.inputView}>
                        <OText
                            style={styles.inputTitleText}
                            text={'FORGOTPASSWORD_ADDRESS'}
                        />
                        <OTextInput
                            layoutStyle={{ marginTop: 10 }}
                            placeholder={I18n('LOGIN.FORGOTPASSWORD_TIP')}
                            ref={'accountTextInput'}
                            onChangeText={(text) => this.onTextChange(text)}
                            keyboardType={'email-address'}
                            textColor={'#333333'}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => this.onPressSend()}
                    >
                        <View style={styles.btnView}>
                            <OText
                                style={styles.btnText}
                                text={'LOGIN.FORGOTPASSWORD_SENT'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </CommonHeader>
        );
    }

}

const styles = StyleSheet.create({
    viewStyle: {
        backgroundColor: '#ffffff',
        marginTop: Utils.scale(16),
    },
    forgetTitle: {
        color: '#333333',
        alignSelf: 'flex-start',
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 26,
        marginLeft: 30,
    },
    forgotText: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 24,
        fontSize: 14,
        color: '#666666'
    },
    inputView: {
        height: 87,
        width: Screen.kWidth,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 80
    },
    inputTitleText: {
        alignSelf: 'flex-start',
        fontSize: 12,
        fontFamily: 'HelveticaNeue',
        color: '#999'
    },
    btnView: {
        marginTop: 23,
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: Constant.bottomBtnBg
    },
    btnText: {
        color: '#ffffff',
        alignSelf: 'center',
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 16
    }
});
