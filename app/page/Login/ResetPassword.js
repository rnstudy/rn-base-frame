import React, { Component } from 'react';
import I18n, { changeLocale } from '../../config/i18n'
import NetUtils from '../../utils/NetUtils';
import {
    RESET_PASSWORD,
} from '../../utils/Api';
import LoadingView from '../../component/LoadingView/LoadingView';
import * as Constant from '../../utils/Constant'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Toast from '../../component/Toast'
import OTextInput from '../../component/OTextInput/OTextInput'
import OText from '../../component/OText/OText';
import Utils from '../../utils/Utils'

import CommonHeader from '../../component/Header/CommonHeader';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            npwText: '',
            cpwText: '',
        };
    }

    render() {
        return (
            <CommonHeader
                title=''
            >
                {
                    this.state.showLoading ? (
                        <LoadingView cancel={() => this.setState({ showLoading: false })} />
                    ) : (null)
                }

                <ScrollView>
                    <View style={{ marginLeft: Utils.scale(30), marginRight: Utils.scale(30) }}>
                        <OText style={styles.title} text={'LOGIN.TEXT_RESET_PASSWORD'} />
                        <OText style={styles.subTitle} text={'CHANGE_PASSWORD.RESETPASSWORD_TEXT'} />
                        <OText style={styles.npwTitle} text={'CHANGE_PASSWORD.RESETPASSWORD_NEW_PASSWORD'} />
                        {/* 新密码 */}
                        <OTextInput
                            ref='npwTextInput'
                            isPassword={true}
                            layoutStyle={styles.pw}
                            placeholder={I18n('CHANGE_PASSWORD.RESETPASSWORD_TIP')}
                            bottomLineColor='#E5E5E5'
                            maxLength={20}
                            textColor={Constant.blackText}
                            placeholderTextColor={Constant.lightText}
                            onChangeText={(text) => {
                                this.refs.npwTextInput.setErrorText("");
                                this.setState({ npwText: text })
                            }}
                        />
                        {/* 确认密码 */}
                        <OText style={styles.cpwtitle} text={'CHANGE_PASSWORD.RESETPASSWORD_CONFIRM_PASSWORD'} />
                        <OTextInput
                            ref='cpwTextInput'
                            isPassword={true}
                            layoutStyle={styles.pw}
                            bottomLineColor='#E5E5E5'
                            maxLength={20}
                            textColor={Constant.blackText}
                            //placeholder={I18n('RESETPASSWORD_TIP')}
                            placeholderTextColor={Constant.lightText}
                            onChangeText={(text) => {
                                this.refs.cpwTextInput.setErrorText("");
                                this.setState({ cpwText: text })
                            }}
                        />

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => this.resetPassword()}
                            activeOpacity={1}>
                            <OText style={styles.saveTitle} text={'CHANGE_PASSWORD.TEXT_RESET_PASSWORD'} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </CommonHeader>
        )
    }

    resetPassword() {
        let npwText = this.state.npwText + '';
        let cpwText = this.state.cpwText + '';
        if (npwText.length === 0) {
            this.refs.npwTextInput.setErrorText(I18n("LOGIN.CHANGE_PASSWORD_INPUT"))
            return;
        } else if (!Utils.isPassword(npwText)) {
            this.refs.npwTextInput.setErrorText(I18n("LOGIN.TEXT_PASSWORD_INVALID"))
            return;
        }
        if (cpwText.length === 0) {
            this.refs.cpwTextInput.setErrorText(I18n("LOGIN.CHANGE_PASSWORD_INPUT"))
            return;
        } else if (!Utils.isPassword(cpwText)) {
            this.refs.cpwTextInput.setErrorText(I18n("LOGIN.TEXT_PASSWORD_INVALID"))
            return;
        }

        this.setState({ showLoading: true });
        let param = {
            email: this.props.email,
            passwd: npwText,
            token: this.props.verify,
        }
        NetUtils.post(RESET_PASSWORD, param, false).then((result) => {
            this.setState({ showLoading: false });
            Toast.show(I18n('CHANGE_PASSWORD.RESETPASSWORD_SUCC'));
            setTimeout(() => {
                Actions.reset('Login');
            }, 2000);
        }).catch((error) => {
            this.setState({ showLoading: false });
            this.refs.npwTextInput.setErrorText(error.msg);
        })
    }
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: Utils.scale(26),
        color: Constant.blackText,
        marginTop: Utils.scale(30),
    },
    subTitle: {
        fontSize: Utils.scale(14),
        color: Constant.grayText,
        paddingTop: Utils.scale(26),
    },
    npwTitle: {
        fontSize: Utils.scale(12),
        color: Constant.blackText,
        paddingTop: Utils.scale(40),
    },
    cpwtitle: {
        fontSize: Utils.scale(12),
        color: Constant.blackText,
        paddingTop: Utils.scale(30),
    },
    pw: {
        height: Utils.scale(40),
        fontSize: Utils.scale(14),
        paddingTop: Utils.scale(10),
    },
    saveButton: {
        marginTop: Utils.scale(40),
        backgroundColor: '#FD5F10',
        height: Utils.scale(48),
        borderRadius: Utils.scale(24),
        justifyContent: 'center',
    },
    saveTitle: {
        fontWeight: 'bold',
        fontSize: Utils.scale(14),
        color: '#FFF',
        textAlign: 'center',
    },
})