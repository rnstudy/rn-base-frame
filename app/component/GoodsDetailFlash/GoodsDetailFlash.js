import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    Platform,
    Text
} from 'react-native';
import OText from '../../component/OText/OText';
import CommonWebView, {
    NAVIGATION_SUSPENSION,
    NAVIGATION_BACK,
    NAVIGATION_HIDE
} from '../../pages/CommonWebView/CommonWebView';
import I18n from "../../config/i18n";
const { width, height } = Dimensions.get('window');
import SHARE_ICON from '../../res/img/share_gray.png';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import ImageView from '../../component/ImageView/ImageView';
import AppSetting from "../../store/AppSetting";

import { END_STATE, ON_SALE_STATE, COMING_STATE } from '../../store/FlashSaleStore';

import CountTime from '../../utils/CountTime';

export default class GoodsDetailFlash extends Component {

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
            },
            lastCount: props.countTime
        }
        new CountTime().countDownAction(this);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.timerCount + '' === '0' && nextProps.countTime !== this.state.lastCount) {
            this.setState({
                timerCount: nextProps.countTime,
                lastCount: nextProps.countTime,
            })
        }
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    //渲染
    render() {
        const { DD, HH, MM, SS } = this.state.countdownObj
        const { countState } = this.props;
        let text = null;
        let bgStyle = styles.viewStyle;
        let showPrice = false;
        switch (countState) {
            case END_STATE:
                return <View />
                break;
            case COMING_STATE:
                text = "FLASH_STARTS_IN";
                showPrice = true;
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
                {showPrice ? <Text style={styles.priceText}>
                    <OText
                        text={'STORE_FLASHSALE_TITLE'}
                        style={styles.dayText}
                    /> {this.props.price}
                </Text> : <OText
                        text={'STORE_FLASHSALE_TITLE'}
                        style={styles.dayText}
                    />}

                <Text style={styles.dayText}>
                    <OText
                        text={text}
                        style={styles.textStyle}
                    />  {DD && DD + '' != '00' ? <Text style={styles.numText}>{DD}<Text style={styles.numSpace}>{I18n('STORE_SALES_D')} </Text> </Text> : null}
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
        paddingRight: Utils.scale(16),
        backgroundColor: Constant.blackText,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    textStyle: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: 'white',
        marginRight: Utils.scale(8),
    },
    dayText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: 'white',
        fontWeight: 'normal',
    },
    leftText: {
        color: 'white'
    },
    priceText: {
        fontSize: Utils.scaleFontSizeFunc(17),
        color: 'white',
        fontWeight: 'bold',
        width: '50%',
    }
});
