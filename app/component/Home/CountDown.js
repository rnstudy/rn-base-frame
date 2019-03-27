import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import I18n from "../../config/i18n";
import CountTime from "../../utils/CountTime";

export default class CountDown extends Component {

    constructor(props) {
        super(props)
        const {remainingTime} = this.props;
        this.state = {
            timerCount: remainingTime || 30 * 24 * 3600 - 30 * 24 * 3500,//倒计时：秒
            countdownObj: {
                DD: '',
                HH: '',
                MM: '',
                SS: ''
            }
        }

        new CountTime().countDownAction(this);
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    render() {
        const {countdownObj, isNeedSeperate} = this.state;
        if (countdownObj.DD === '') {
            return null;
        }
        return (
            <View style={styles.countdown}>
                <Text style={{ marginRight: 8 }}
                >{this.props.isStarted ? I18n('FLASH_ENDS_IN') : I18n('FLASH_STARTS_IN')}</Text>
                {/* 天 */}
                {countdownObj.DD > 0 ? <View style={styles.countdown}>
                        <Text style={styles.numText}>{countdownObj.DD}</Text>
                        <Text style={styles.numSpace}>{I18n('STORE_SALES_D')}</Text>
                    </View>
                    : null}

                {/* 时 */}
                <Text style={styles.numText}>{countdownObj ? countdownObj.HH : '00'}</Text>
                {isNeedSeperate ? <Text style={styles.numSpace}>:</Text> : null}
                {/* 分 */}
                <Text style={styles.numText}>{countdownObj ? countdownObj.MM : '00'}</Text>
                {isNeedSeperate ? <Text style={styles.numSpace}>:</Text> : null}
                {/* 秒 */}
                <Text style={styles.numText}>{countdownObj ? countdownObj.SS : '00'}</Text>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    countdown: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    numBg: {
        backgroundColor: Constant.blackText,
        borderRadius: Utils.scale(4),
        // width: Utils.scale(32),
        // height: Utils.scale(32),
        justifyContent: 'center',
        alignItems: 'center',
    },
    numText: {
        color: '#FFF',
        fontSize: Utils.scaleFontSizeFunc(12),
        textAlign: 'center',
        backgroundColor: Constant.blackText,
        borderRadius: Utils.scale(4),
        padding: Utils.scale(3),
        marginRight: Utils.scale(4)
    },
    numSpace: {
        fontSize: Utils.scale(14),
        color: Constant.blackText,
        paddingRight: Utils.scale(4),
        fontWeight: 'bold',
    },
});




