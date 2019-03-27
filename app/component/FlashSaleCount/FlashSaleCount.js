import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    Text
} from 'react-native';
import OText from '../../component/OText/OText';
import CommonWebView, {
    NAVIGATION_SUSPENSION,
    NAVIGATION_BACK,
    NAVIGATION_HIDE
} from '../../pages/CommonWebView/CommonWebView'
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import I18n from "../../config/i18n";

import CountTime from '../../utils/CountTime';


import { END_STATE, ON_SALE_STATE, COMING_STATE } from '../../store/FlashSaleStore';

export default class FlashSaleCount extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            timerCount: props.countTime || 30 * 24 * 3600 - 20 * 24 * 3600,//倒计时：秒
            countdownObj: {
                DD: '',
                HH: '',
                MM: '',
                SS: ''
            }
        }
        new CountTime().countDownAction(this);
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    //渲染
    render() {
        const { DD, HH, MM, SS } = this.state.countdownObj;
        const { countState } = this.props;
        let text = null;
        let bgStyle = styles.viewStyle;
        switch (countState) {
            case END_STATE:
                return <View />
                break;
            case COMING_STATE:
                text = "FLASH_STARTS_IN";
                break;
            case ON_SALE_STATE:
                text = 'FLASH_ENDS_IN';
                bgStyle = [bgStyle, { backgroundColor: Constant.themeText }]
                break;
            default:
                break;
        }
        return (
            <View style={bgStyle}>
                <OText
                    text={text}
                    style={styles.textStyle}
                />
                <Text style={styles.dayText}>
                    {DD && DD + '' != '00' ? <Text style={styles.numText}>{DD}<Text style={styles.numSpace}>{I18n('STORE_SALES_D')} </Text> </Text> : null}
                    {HH}:{MM}:{SS}</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({

    viewStyle: {
        width: '100%',
        height: Utils.scale(48),
        paddingLeft: Utils.scale(16),
        backgroundColor: Constant.blackText,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    textStyle: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: 'white',
        marginRight: Utils.scale(8),
    },
    dayText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        fontWeight: 'bold',
        color: 'white',
        width: '60%'
    },

});
