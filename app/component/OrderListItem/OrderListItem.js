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
import OrderItemProduct from './OrderItemProduct';
import OrderItemBuyer from './OrderItemBuyer';
import OrderScrollProduct from '../../component/OrderListItem/OrderScrollProduct'

export default class OrderListItem extends Component {

    //渲染
    render() {
        const { item } = this.props;
        const { userInfo, orderTime, orderStatus, productCount, unit, total, commission, orderId } = item;
        const { headImgUrl, nickname, } = userInfo

        let CardLine = <View style={styles.fullLine}></View>

        let stateObj = OrderUtils.getOrderStatus(orderStatus + '');
        let earnText = stateObj.earnText;
        return (
            <TouchableOpacity
                onPress={() => this.props.toSalesDetail(orderId)}
                activeOpacity={1}
            >
                <View
                    style={styles.cardContain}
                >   
                    <OrderItemBuyer
                        orderTime={orderTime}
                        nickname={nickname}
                        headImgUrl={headImgUrl}
                        orderStatus={''}
                    />
                    <OrderScrollProduct item={item}></OrderScrollProduct>
                    {CardLine}
                    <View style={styles.CardBottomFrag}>
                        <View style={styles.cardBottomText}>
                            <OText
                                style={styles.cardBottomText}
                                text={'SALEORDER.STORE_SALE_ORDERS_TOTAL'}
                                option1={{ num: productCount }}
                            />
                            <Text style={{
                                fontSize: Utils.scale(12),
                                color: Constant.blackText
                            }}> {unit}{total}</Text>
                        </View>
                        <OText
                            style={orderStatus+'' === '8' || orderStatus+'' === '5' ? styles.cardBottomText1 : styles.cardBottomText2}
                            text={earnText}
                            option1={{ num: productCount }}
                        >
                            {
                                orderStatus+'' === '8' || orderStatus+'' === '5' ? null : <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: Utils.scale(20),
                                    color: '#FD5F10'
                                }}>{'  '}{unit}{commission}</Text>
                            }
                            
                        </OText>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
};

const styles = StyleSheet.create({
    scrollBg: {
        backgroundColor: 'white'
    },
    cardContain: {
        flex: 1,
        backgroundColor: Constant.boldLine,
        alignItems: 'center',
    },
    tintStyle: {},
    fullLine: {
        width: '100%',
        height: .5,
        backgroundColor: '#e5e5e5'
    },
    CardBottomFrag: {
        width: '100%',
        padding: 16,
        backgroundColor: '#fff',
        height: 77,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    cardBottomText: {
        flexDirection:'row',
        fontSize: Constant.smallSize,
        color: Constant.grayText,
    },
    cardBottomText1: {
        fontSize: Constant.smallSize,
        fontWeight:'bold',
        color: Constant.blackText,
        marginTop: 8
    },
    cardBottomText2: {
        fontSize: Constant.smallSize,
        color: Constant.grayText,
        marginTop: 8
    },
    emptyView: {
        width: '100%',
        height: Utils.scale(300),
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyImg: {
        width: Utils.scale(120),
        height: Utils.scale(100),
    },
    emptyText: {
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(14),
    },
});




