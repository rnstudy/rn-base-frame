import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Utils from "../../utils/Utils";
import PortraitPlaceholder from '../../res/img/default_group_people.png';
import SettingIcon from '../../res/img/account_settings.png';
import * as Constant from '../../utils/Constant';
import OText from '../OText/OText';
const { width, height } = Dimensions.get('window');
import CountTime from '../../utils/CountTime';

export default class CheckOutBtn extends Component {

    constructor(props) {
        super(props);
        let timerCount = props.occupyTime;
        this.state = {
            timerCount: timerCount,
            countdownObj: {
                DD: '',
                HH: '',
                MM: '',
                SS: ''
            },
            timeOut: false
        };
        timerCount && timerCount > 0 && new CountTime().countDownAction(this);
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    render() {
        const { timeOut, countdownObj, timerCount } = this.state;
        const { DD, HH, MM, SS } = countdownObj;
        const { totalText, disabled, pressCheckOut } = this.props;
        const viewDisabled = timeOut || disabled
        let touchStyle = !viewDisabled ? styles.checkoutTouch : styles.checkoutTouchDark;
        try {
            return <TouchableOpacity
                onPress={() => pressCheckOut && pressCheckOut()}
                style={touchStyle}
                disabled={viewDisabled}
            >
                <View style={styles.checkOutTouchView}>
                    <OText
                        style={styles.payText}
                        text={'CHECKOUT_PAY'}
                    />
                    <Text style={styles.payText}>{totalText}</Text>
                    {timerCount != null && timerCount >= 0 && <Text style={styles.dayText}>{MM + ''}:{SS + ''}</Text>}
                </View>
            </TouchableOpacity>
        } catch (error) {

            return <View />
        }

    }
}

const styles = StyleSheet.create({
    checkoutTouch: {
        left: Utils.scale(16),
        bottom: Utils.scale(38),
        position: 'absolute',
        width: width - Utils.scale(32),
        height: Utils.scale(50),
        borderRadius: Utils.scale(25),
        backgroundColor: Constant.themeText,
    },
    checkoutTouchDark: {
        left: Utils.scale(16),
        bottom: Utils.scale(38),
        position: 'absolute',
        width: width - Utils.scale(32),
        height: Utils.scale(50),
        borderRadius: Utils.scale(25),
        backgroundColor: Constant.loadmoreColor,
    },
    checkOutTouchView: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        height: '100%'
    },
    payText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: 'white',
    },
    dayText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: 'white',
        marginLeft: 20
    },
});