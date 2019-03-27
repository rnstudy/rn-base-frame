import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import I18n from '../../config/i18n'
import Screen from "../../utils/Screen";
import OTextInput from "../../component/OTextInput/OTextInput";
import NetUtils from "../../utils/NetUtils";
import {STORE_INFO} from "../../utils/Api";
import {Actions} from "react-native-router-flux";
import Utils from '../../utils/Utils'
import LoadingView from '../../component/LoadingView/LoadingView';
import * as Constant from "../../utils/Constant"
import CommonHeader, {NAVIGATION_BACK} from '../../component/Header/CommonHeader';
import OText from '../../component/OText/OText';

export default class InviteCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            verifyCode: '',
            itemData: null,
        };
    }

    onPressSend() {
        const { verifyCode } = this.state;
        if (verifyCode + '' === '') {
            this.refs.accountTextInput.setErrorText(I18n('LOGIN.ERROR_INVITE_CODE'))
            return;
        }

        this.setState({ showLoading: true });
        let param = {
            storeId: verifyCode,
        };

        NetUtils.get(STORE_INFO, param, false).then((result) => {
            this.setState({ showLoading: false });
            if (result.code === 0) {
                Actions.push('ApplyPartner')
            }
        }).catch((error) => {
            this.setState({ showLoading: false });
            this.refs.accountTextInput.setErrorText(I18n('LOGIN.ERROR_INVITE_CODE'))
            console.log("error.msg = ",error.msg);
        });
    }

    onTextChange(text) {
        this.refs.accountTextInput.setErrorText('');
        this.state.verifyCode = text.trim();
    }

    render() {
        return (
            <CommonHeader
                showDivider={false}
                titleType={NAVIGATION_BACK}
                title={''}
                backAction={() => {
                    Actions.reset('Login')
                }}
            >
                <View style={styles.viewStyle}>
                    {
                        this.state.showLoading ? (
                            <LoadingView cancel={() => this.setState({ showLoading: false })} />
                        ) : (null)
                    }
                    <OText
                        style={styles.forgetTitle}
                        text={'LOGIN.TEXT_INVITE_CODE'}
                    />

                    <View style={styles.inputView}>
                        <OTextInput
                            ref={'accountTextInput'}
                            layoutStyle={{ marginTop: 10 }}
                            placeholder={I18n('LOGIN.ENTER_INVITE_CODE')}
                            onChangeText={(text) => this.onTextChange(text)}
                            keyboardType={'numeric'}
                            textColor={'#333333'}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => this.onPressSend()}
                    >
                        <View style={styles.btnView}>
                            <OText
                                style={styles.btnText}
                                text={'LOGIN_OK'}
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
    inputView: {
        height: 87,
        width: Screen.kWidth,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 60
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
