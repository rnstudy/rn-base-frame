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
import moment from 'moment';
import CommonWebView, {
    NAVIGATION_SUSPENSION,
    NAVIGATION_BACK,
    NAVIGATION_HIDE
} from '../../pages/CommonWebView/CommonWebView'
const { width, height } = Dimensions.get('window');
import SHARE_ICON from '../../res/img/share_gray.png';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import ImageView from '../../component/ImageView/ImageView';
import AppSetting from "../../store/AppSetting";

import { END_STATE, ON_SALE_STATE, COMING_STATE } from '../../store/FlashSaleStore';

export default class FlashSaleTab extends Component {

    //默认属性
    static defaultProps = {

    };

    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
        }
    }

    //渲染
    render() {
        const { obj, page, isTabActive, handlePress, onLayoutHandler } = this.props;

        const { startTime, state, dateFormat, timeFormat } = obj;
        const star = moment.unix(startTime)
        let textStyle = styles.timeText;
        if (isTabActive) {
            textStyle = [textStyle, { color: Constant.themeText }]
        } else if (state + '' === END_STATE) {
            textStyle = [textStyle, { color: Constant.grayText }]
        }
        let stateText = 'STORE_FLASHSALE_END'
        switch (state) {
            case END_STATE:
                stateText = 'STORE_FLASHSALE_END'
                break;
            case ON_SALE_STATE:
                stateText = 'STORE_FLASHSALE_ONSALE'
                break;
            case COMING_STATE:
                stateText = 'STORE_FLASHSALE_UPCOMING'
                break;
            default:
                break;
        }

        return (
            <TouchableOpacity
                onPress={() => handlePress(page)}
                style={styles.container}
                onLayout={(obj) => onLayoutHandler(obj)}
            >
                <View style={styles.viewStyle}>
                    <Text style={textStyle}>{timeFormat}</Text>
                    <Text style={[textStyle, { fontSize: Constant.miniSize, marginTop: Utils.scale(3) }]}>{dateFormat}</Text>
                    <OText
                        style={[textStyle, { fontSize: Constant.miniSize, marginTop: Utils.scale(10) }]}
                        text={stateText}
                    />
                </View>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        marginLeft: Utils.scale(15),
        marginRight: Utils.scale(15),
    },
    viewStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeText: {
        fontSize: Constant.largeSize,
        color: Constant.blackText,
    },


    imgStyle: {
        width: Utils.scale(165),
        height: Utils.scale(209),
        borderRadius: Utils.scale(4),
    },
    priceView: {
        flexDirection: 'row',
        width: '100%',
        height: Utils.scale(22),
        justifyContent: 'space-between',
        marginTop: Utils.scale(8),
    },
    priceText: {
        fontSize: Utils.scaleFontSizeFunc(18),
        fontWeight: 'bold',
        color: Constant.blackText,
        width: '60%'
    },
    shareImage: {
        width: Utils.scale(16),
        height: Utils.scale(16),
    },
    bonusText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(4),
    },
    bonusView: {
        marginTop: Utils.scale(18),
    },
    detailText: {
        color: Constant.lightText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(8),
    },
    soldOutViewStyle: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    soldOutBg: {
        width: Utils.scale(80),
        height: Utils.scale(80),
        borderRadius: Utils.scale(40),
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    soldOutText: {
        color: 'white',
        fontSize: Utils.scaleFontSizeFunc(12),
        width: '80%',
        textAlign: 'center'
    }
});
