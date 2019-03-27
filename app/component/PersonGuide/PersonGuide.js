import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import Utils from "../../utils/Utils";
import * as Constant from '../../utils/Constant';
import GUIDE_EN from '../../res/img/guide_en.png';
import GUIDE_ZH from '../../res/img/guide_zh.png';
import CLOSE from '../../res/img/white_close_circle.png';
import OText from '../OText/OText';
const { width, height } = Dimensions.get('window');
import AppSetting from "../../store/AppSetting";
import { NAVIGATION_BACK } from '../../pages/CommonWebView/CommonWebView'
import I18n from '../../config/i18n'
import {
    WEB_PERSON_GUIDE
} from "../../utils/Api";
import { Actions } from 'react-native-router-flux';
export default class PersonGuide extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const IMG = AppSetting.getCurrentLanguage.code === 'zh_cn' ? GUIDE_ZH : GUIDE_EN
        return (
            <View style={{
                position: 'absolute',
                width: width,
                height: height,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 888,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <TouchableWithoutFeedback
                    onPress={() => { this.props.closeFun() }}
                ><View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: width,
                    height: height,
                }}>
                        <TouchableOpacity onPress={() => {
                            this.props.closeFun()
                            Actions.push('CommonWebView', {
                                titleData: {
                                    titleType: NAVIGATION_BACK,
                                    title: I18n('STORE_PERSONAL_NEW_GUIDE'),
                                },
                                nextUrl: AppSetting.BaseUrl + WEB_PERSON_GUIDE,
                                homeWeb: false
                            });
                        }}>
                            <Image
                                style={{
                                    height: Utils.scale(311),
                                    width: Utils.scale(250),
                                }}
                                source={IMG}
                            />
                        </TouchableOpacity>
                        <Image source={CLOSE} style={{
                            height: Utils.scale(35),
                            width: Utils.scale(35),
                        }} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    contentView: {
        alignItems: 'center',
        margin: Utils.scale(30),
    },
    frozenIcon: {
        width: Utils.scale(248),
        height: Utils.scale(140),
    },
    frozenTitle: {
        fontWeight: 'bold',
        fontSize: Utils.scale(18),
        color: Constant.blackText,
        textAlign: 'center',
        paddingTop: Utils.scale(20),
    },
    frozenTips: {
        fontSize: Utils.scale(12),
        color: Constant.lightText,
        textAlign: 'center',
        paddingTop: Utils.scale(20),
        lineHeight: Utils.scale(18),
    }
});
