import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import OText from '../../component/OText/OText';

import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import I18n from "../../config/i18n";
import ICON1 from '../../res/images/home_list_icon1.png';
import ICON2 from '../../res/images/home_list_icon2.png';

import CountTime from '../../utils/CountTime';

export default class SpecialListCount extends Component {

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
        const { horItem, changeItemType } = this.props
        const { DD, HH, MM, SS } = this.state.countdownObj;
        return (
            <View style={styles.viewStyle}>
                <View>
                    <OText
                        text={'COMMON.FLASH_ENDS_IN'}
                        style={styles.dayText}
                    >
                        <Text >
                            {DD && DD + '' != '00' ? <Text style={styles.numText}>{DD}<Text style={styles.numSpace}>{I18n('STORE_SALES_D')} </Text> </Text> : null}
                            {HH}:{MM}:{SS}</Text>
                    </OText>
                </View>

                {changeItemType && <TouchableOpacity
                    onPress={() => changeItemType && changeItemType()}
                    activeOpacity={1}
                >
                    <Image
                        style={styles.imageStyle}
                        source={horItem ? ICON1 : ICON2}
                    />
                </TouchableOpacity>}
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
        backgroundColor: "#f8f8f8",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
    },
    textStyle: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.blackText,
        marginRight: Utils.scale(8),
    },
    dayText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.blackText,
    },
    imageStyle: {
        width: Utils.scale(16),
        height: Utils.scale(16),
    }
});
