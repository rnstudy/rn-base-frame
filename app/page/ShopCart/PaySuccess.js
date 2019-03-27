/**
 * Created by Administrator on 2017/4/28.
 */

'use strict';
import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    RefreshControl,
    Alert,
    InteractionManager,
    Dimensions
} from 'react-native';
// import * as Api from '../../utils/Api';
import CommonHeader, { NAVIGATION_HIDE } from '../../component/Header/CommonHeader';
import { inject, observer } from 'mobx-react/native';
import Utils from '../../utils/Utils';
import * as Constant from '../../utils/Constant'
import I18n from '../../config/i18n'
import OText from '../../component/OText/OText'
import { Actions } from 'react-native-router-flux';
import SUCCESS_ICON from '../../res/images/pay_success.png';
const { width, height } = Dimensions.get('window');

@inject(stores => ({
    shopCartStore: stores.shopCartStore,
    shopStore: stores.shopStore,
}))
@observer
export default class PaySuccess extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentWillMount() {
    }

    backHome() {
        Actions.reset('HomePage')
    }

    viewOrder() {
        Actions.reset('HomePage')
        setTimeout(() => {
            Actions.push('OrderList')
        }, 1000)
    }

    render() {
        return (
            <CommonHeader
                titleType={NAVIGATION_HIDE}
            >
                <View style={styles.topView}>
                    <Image source={SUCCESS_ICON} />
                    <OText
                        text={'CHECKOUT.PAY_SUCCESS'}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.touchStyle, { backgroundColor: Constant.themeText, marginBottom: Utils.scale(15) }]}
                    onPress={() => this.backHome()}
                >
                    <OText
                        text={'CHECKOUT.PAY_FAIL_BACK'}
                        style={styles.textTop}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.touchStyle, styles.touchWhite]}
                    onPress={() => this.viewOrder()}
                >
                    <OText
                        style={styles.textBottom}
                        text={'CHECKOUT.PAY_VIEW_ORDER'}
                    />
                </TouchableOpacity>


            </CommonHeader>
        )
    }
}
//module.exports = MyWebView;

let styles = StyleSheet.create({
    topView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    touchStyle: {
        width: width - Utils.scale(72),
        height: Utils.scale(50),
        borderRadius: Utils.scale(25),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Utils.scale(32),
        marginBottom: Utils.scale(30)
    },
    touchWhite: {
        backgroundColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#cccccc",
        marginTop: Utils.scale(12),
        marginBottom: Utils.scale(32),
    },
    textTop: {
        color: 'white',
        fontSize: Constant.normalSize,
    },
    textBottom: {
        color: Constant.grayText,
        fontSize: Constant.normalSize,
    },

});