import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager
} from 'react-native';
import I18n from '../../config/i18n'
import Screen from "../../utils/Screen";
import OTextInput from "../../component/OTextInput/OTextInput";
import NetUtils from "../../utils/NetUtils";
import { Actions } from 'react-native-router-flux'
import CommonHeader, { NAVIGATION_BACK } from '../../component/Header/CommonHeader';
import Api, {
    RESEND_CODE,
    VERIFY_CODE,
} from '../../utils/Api'
import LoadingView from '../../component/LoadingView/LoadingView';
import Storage from '../../utils/StorageUtils';
import * as Constant from "../../utils/Constant"
import Utils from '../../utils/Utils'

import OText from '../../component/OText/OText';

export default class Verification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            itemData: props.itemData
        };
    }

    componentDidMount() {
        this.refs.codeTextInput.start();
    }


    onPressConfirm() {
        this.setState({ showLoading: true });
        let param = {
            code: this.state.verifiCode,
            type: this.state.itemData.type,
            email: this.state.itemData.email,
        };

        NetUtils.post(VERIFY_CODE, param, false).then((result) => {
            if (result.code === 0) {
                if (this.state.itemData.type === 1) {
                    global.userInfo = result.data;
                    Storage.save({
                        key: Constant.USER_INFO,
                        data: result.data,
                        expires: null
                    });
                    InteractionManager.runAfterInteractions(() => {
                        Actions.reset('ApplyPartner');
                    })
                } else {
                    this.setState({ showLoading: false });
                    let itemData = {
                        token: result.data.token,
                        email: this.state.itemData.email,
                    };
                    Actions.push('ResetPassword', { verify: itemData.token, email: itemData.email });
                }
            }
        }).catch((error) => {
            this.setState({ showLoading: false });
            this.refs.codeTextInput.setErrorText(error.msg);
        });
    }

    onTextChange(text) {
        this.setState({ verifiCode: text });
    }

    //重发验证码
    pressRegain() {
        this.setState({ showLoading: true });
        let param = {
            email: this.state.itemData.email,
            type: this.state.itemData.type,
        };
        NetUtils.post(RESEND_CODE, param).then((result) => {
            this.setState({ showLoading: false });

            this.refs.codeTextInput.start();
        }).catch((error) => {
            this.setState({ showLoading: false });

        });
    }


    render() {
        const { itemData } = this.state;
        const { email } = itemData;
        const disableBtn = this.state.verifiCode == null || this.state.verifiCode == '' || this.state.verifiCode.length != 4
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

                    <ScrollView>
                        <Image source={require('../../res/images/get_email_icon.png')}
                            style={{
                                alignSelf: 'center'
                            }}
                        />
                        <OText
                            text={'LOGIN.CONFIRM_TEXT1'}
                            style={{
                                marginLeft: 30,
                                marginRight: 30,
                                marginTop: 32,
                                fontSize: 14,
                                lineHeight: 20,
                                color: '#333333'
                            }}
                        >{email}</OText>
                        <OText
                            text={'LOGIN.CONFIRM_TEXT2'}
                            style={{
                                marginLeft: 30,
                                marginRight: 30,
                                marginTop: 12,
                                fontSize: 14,
                                lineHeight: 20,
                                color: '#333333'
                            }}
                        />
                        <OText
                            text={'LOGIN.CONFIRM_TEXT3'}
                            style={{
                                marginLeft: 30,
                                marginRight: 30,
                                marginTop: 12,
                                fontSize: 14,
                                lineHeight: 20,
                                color: '#333333'
                            }}
                        />
                        {/*  输入验证码 */}
                        <View style={styles.verifiCodeView}>
                            <OText
                                text={'LOGIN.CONFIRM_VERIFICATION_CODE'}
                                style={{
                                    alignSelf: 'flex-start',
                                    fontSize: 12,
                                    fontFamily: 'HelveticaNeue',
                                    color: '#333333'
                                }}
                            />
                            <OTextInput
                                ref='codeTextInput'
                                isVerification={true}
                                layoutStyle={{ marginTop: 10 }}
                                placeholder={I18n('LOGIN.TEXT_EMAIL_VERTI')}
                                onChangeText={(text) => this.onTextChange(text)}
                                maxLength={4}
                                keyboardType="default"
                                textColor={'#333333'}
                                pressRegain={() => this.pressRegain()}
                            />
                        </View>

                        {/* 确定  */}
                        <TouchableOpacity
                            onPress={() => this.onPressConfirm()}
                            disabled={disableBtn}
                            activeOpacity={1}>
                            <View style={[{
                                marginTop: 23, height: 50, borderRadius: 100, justifyContent: 'center', marginLeft: 30,
                                marginRight: 30,
                            }, (disableBtn) ? { backgroundColor: '#CCCCCC' } : { backgroundColor: Constant.bottomBtnBg }]}>
                                <OText
                                    style={{
                                        color: '#ffffff',
                                        alignSelf: 'center',
                                        fontFamily: 'HelveticaNeue-Bold',
                                        fontSize: 16
                                    }}
                                    text={'COMMON.CONFIRM'}
                                />
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </CommonHeader>
        );
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        backgroundColor: '#ffffff',
        // flex: 1,
        //alignItems:'center'
        marginTop: Utils.scale(32),
    },
    verifiCodeView: {
        height: 87,
        width: Screen.kWidth,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 42
    }

});
