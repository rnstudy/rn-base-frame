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

import CountTime from '../../utils/CountTime';

export default class PayButton extends Component {
    //构造函数
    constructor(props) {
        super(props);
        this.state = {
            timerCount: props.timerCount || 0,//倒计时：秒
            countdownObj: {
                DD: '00',
                HH: '00',
                MM: '00',
                SS: '00'
            }
        }

        if (props.timerCount !== 0) {
            new CountTime().countDownAction(this);
        }
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    //渲染
    render() {
        const { MM, SS } = this.state.countdownObj;

        // console.log('MM,SS', this.state.timerCount, MM, SS);

        if (MM === '00' && SS === '00') {// 倒计时为0
            return (
                <TouchableOpacity
                    style={[this.props.buttonStyle, styles.payBg2]}
                    activeOpacity={1}
                >
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: Utils.scale(16),
                        marginRight: Utils.scale(16),
                        marginTop: Utils.scale(8),
                        marginBottom: Utils.scale(8),
                        width:Utils.scale(121),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <OText
                            text={'ORDERS_PAY'}
                            style={styles.textStyle}
                        />
                    </View>
                </TouchableOpacity>
            )
        } else {// 有倒计时
            return (
                <TouchableOpacity
                    style={[this.props.buttonStyle, styles.payBg]}
                    onPress={this.props.onPress}>
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: Utils.scale(16),
                        marginRight: Utils.scale(16),
                        marginTop: Utils.scale(8),
                        marginBottom: Utils.scale(8),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <OText
                            text={'ORDERS_PAY'}
                            style={styles.textStyle}
                        />
                        <Text style={styles.dayText}>{MM}:{SS}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }
}

const styles = StyleSheet.create({
    payBg: {
        backgroundColor: '#FD5F10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    payBg2: {
        backgroundColor: '#CCCCCC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        fontSize: Utils.scale(14),
        fontWeight: 'bold',
        color: 'white',
    },
    dayText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        fontSize: Utils.scale(14),
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: Utils.scale(0),
        width: Utils.scale(46),
        textAlign: 'right',
    },

});