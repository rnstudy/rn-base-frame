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

const { width, height } = Dimensions.get('window');
import Utils from '../../utils/Utils';
import I18n from '../../config/i18n';
import OText from '../../component/OText/OText';
import * as Constant from "../../utils/Constant"
import HEAD_ICON from '../../res/images/default_head.png';
import OrderUtils from '../../utils/OrderUtils';
//import console = require('console');


export default class OrderItemBuyer extends Component {

    render() {
        const { nickname, orderTime, headImgUrl, orderStatus } = this.props;
        let stateObj = OrderUtils.getOrderStatus(orderStatus + '');
        let odState = stateObj.statusText;
        //console.log("====odState",odState)
        let avatarUrl = HEAD_ICON;
        if ((headImgUrl + '').length > 0 && headImgUrl + '' !== 'null') {
            avatarUrl = { uri: headImgUrl + '' };
        }
        return (
            <View style={styles.cardWrap}>
                <View style={{flex:1, flexDirection: 'row',alignItems:'center' }}>
                    <View>
                        <Image
                                //resizeMode='stretch'
                                source={avatarUrl}
                                style={styles.avatar}
                            />
                    </View>
                    
                    <View style={{flex:1, justifyContent:'center'}}>
                        <Text style={styles.cardTitle}>{nickname + ''}</Text>
                    </View>
                </View>

                <Text style={styles.cardSubTitle}>{orderTime + ''}</Text>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardWrap: {
        //width:width,
        width:'100%',
        height:Utils.scale(60),
        marginTop: Constant.miniSize,
        backgroundColor: '#fff',
        paddingLeft:Utils.scale(16),
        //paddingRight:Utils.scale(95),
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'space-between',
    },
    avatar: {
        width: Utils.scale(36),
        height: Utils.scale(36),
        marginRight: Constant.miniSize,
        borderRadius: Utils.scale(18),
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: Utils.scale(14),
        color: Constant.blackText,
    },
    cardSubTitle: {
        width:Utils.scale(100),
        height:Utils.scale(15),
        fontSize: Constant.miniSize,
        color: Constant.lightText,

    },
    cardRightTitle: {
        fontWeight: 'bold',
        fontSize: Constant.normalSize,
        color: Constant.blackText
    },
})