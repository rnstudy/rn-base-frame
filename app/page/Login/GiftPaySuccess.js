import React, {Component} from 'react';
import {Image, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Actions} from "react-native-router-flux";
import Utils from '../../utils/Utils'
import LoadingView from '../../component/LoadingView/LoadingView';
import * as Constant from "../../utils/Constant"
import OText from '../../component/OText/OText';
import SUCCESS_ICON from '../../res/images/pay_success.png';
import ICON_WECHAT from '../../res/images/more_wechat.png';
import ICON_CODE from '../../res/images/more_code.png';
import * as Clipboard from "react-native/Libraries/Components/Clipboard/Clipboard";
import ViewShot from "../../component/ViewShot/index";
import I18n from "../../config/i18n";
import Toast from "../../component/GoodsDetailModal/Toast";
import {
    BASE_URL_SG,
    BASE_URL_SG_TEST,
    BASE_URL_SG_TEST_NEW, BASE_URL_US, BASE_URL_US_TEST,
    BASE_URL_US_TEST_NEW,
    FOR_TEST
} from "../../store/AppSetting";
import AppSetting from "../../store/AppSetting";
import StringPicker from "../../component/ModalPicker/StringPicker";
import NomalPicker from "../../component/ModalPicker/NomalPicker";

const NOMAL_PICKER_ARR = ['SHARE_MASK_DOWNLOAD'];

export default class PaySuccess extends Component {

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
        Actions.push('HomePage')
    }

    onTextChange(text) {
        this.refs.accountTextInput.setErrorText('');
        this.state.emailTxt = text;
    }

    render() {
        return (
            <SafeAreaView style={styles.viewStyle}>
                <View style={styles.viewStyle}>
                    {
                        this.state.showLoading ? (
                            <LoadingView cancel={() => this.setState({showLoading: false})}/>
                        ) : (null)
                    }

                    <Image style={{
                        alignSelf: 'center',
                        marginTop: 30,
                        widget: 120, height: 120
                    }}
                           source={SUCCESS_ICON}
                           resizeMode={'contain'}
                    />

                    <OText
                        style={styles.successTitle}
                        text={'LOGIN.PAY_SUCCESS_TITLE'}
                    />
                    <TouchableOpacity
                        onPress={() => this.onPressSend()}
                    >
                        <View style={styles.btnView}>
                            <OText
                                style={styles.btnText}
                                text={'LOGIN.PAY_SUCCESS_BTN'}
                            />
                        </View>
                    </TouchableOpacity>

                    <OText
                        style={styles.successBottom}
                        text={'LOGIN.PAY_SUCCESS_BOTTOM'}
                    />

                    <View style={styles.wechatView}>
                        <View style={{
                            marginTop: 14,
                            flexDirection: 'row'
                        }}>
                            <Image style={{
                                marginLeft: 8,
                                widget: 24, height: 19
                            }}
                                   source={ICON_WECHAT}
                                   resizeMode={'contain'}
                            />
                            <OText
                                style={styles.titleBottom}
                                text={'APPLY2_TIP1.TITLE'}
                            />
                        </View>
                        <OText
                            style={styles.text66}
                            text={'LOGIN.PAY_SUCCESS_WECHAT'}
                        />

                        <View style={{
                            marginLeft: 12,
                            marginTop: 14,
                            flexDirection: 'row'
                        }}>
                            <OText
                                style={styles.textGreen}
                                text={'LOGIN.WECHAT_VIP'}
                            />
                            <TouchableOpacity
                                style={{paddingLeft: 12}}
                                onPress={() => this.setContent()}
                            >
                                <OText
                                    style={styles.text99}
                                    text={'APPLY2_COPY'}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: 12
                            }}
                            onPress={() => this.showPicker()}
                        >
                            <ViewShot
                                ref="viewShot"
                            >
                                <Image style={{
                                    widget: 94, height: 94
                                }}
                                       source={ICON_CODE}
                                       resizeMode={'contain'}
                                />
                            </ViewShot>

                        </TouchableOpacity>
                    </View>
                    {this.renderUrlModal()}
                    <Toast ref="toast" />
                </View>
            </SafeAreaView>
        );
    }

    setContent() {
        Clipboard.setString('Littlemall_VIP')
        this.showToast(I18n('CONTACTUS.COPY_SUCCESS'))
    }

    showToast(str){
        this.refs.toast.show(str);
    }

    saveImage(index) {
        console.log("saveImge = ", index)
        if(index === 0){
            this.refs.viewShot.capture().then(uri => {
                this.refs.picker.close();
                this.showToast(I18n('SHARE_MASK_COPY_IMAGE'))
            });
        }
    }

    showPicker() {
        this.refs.picker.open();
    }

    renderUrlModal() {
        return (
            <NomalPicker
                ref='picker'
                data={NOMAL_PICKER_ARR}
                press={(option, index) => this.saveImage(index)}
            />
        );
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        backgroundColor: '#ffffff',
        height: '100%'
    },
    successTitle: {
        color: '#333333',
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    btnView: {
        marginTop: 50,
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        marginLeft: 60,
        marginRight: 60,
        backgroundColor: Constant.bottomBtnBg
    },
    btnText: {
        color: '#ffffff',
        alignSelf: 'center',
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 14
    },
    successBottom: {
        color: '#333333',
        alignSelf: 'center',
        fontSize: 16,
        marginLeft: 30,
        marginTop: 60
    },
    wechatView: {
        width: 343,
        height: Utils.scale(120),
        alignSelf: 'center',
        borderRadius: Utils.scale(6),
        backgroundColor: '#fff',
        marginTop: Utils.scale(25),
        marginBottom: Utils.scale(30),
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowRadius: 3,
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 0},
        //让安卓拥有灰色阴影
        elevation: 8,
        zIndex: Utils.isIOS() ? 1 : 0
    },
    titleBottom: {
        color: '#333333',
        fontSize: 14,
        marginLeft: 1,
        marginTop: 2
    },
    text66: {
        width: 193,
        color: '#666',
        fontSize: 12,
        marginLeft: 12,
        marginTop: 10
    },
    text99: {
        color: '#999',
        fontSize: 12,
    },
    textGreen: {
        color: '#06BB14',
        fontSize: 14,
    },
});
