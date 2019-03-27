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

export default class OrderItemProduct extends Component {

    render() {
        const { prodcutItem, unit } = this.props
        let isRefunded = prodcutItem.isRefunded && prodcutItem.isRefunded === 1;
         //console.log("---prodcutItem",prodcutItem);
        // console.log("unit",unit)
        return (
            <View
                style={styles.cardListItem}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{
                        width: Utils.scale(83),
                        height: Utils.scale(83),
                        marginRight:Utils.scale(13),
                    }}>
                        <Image
                            resizeMode='stretch'
                            source={{ uri: prodcutItem.imgUrl ? prodcutItem.imgUrl : '' }}
                            style={styles.cardItemImg}
                        />
                    </View>

                    <View>
                        <Text
                            numberOfLines={2}
                            style={styles.cardItemTitle}
                        >{prodcutItem.brandName}{prodcutItem.productName}</Text>
                        <Text style={styles.cardSubItemTitle} numberOfLines={1} ellipsizeMode={'tail'}>
                            {/* {false && prodcutItem.skuAttrs.length > 0 ? prodcutItem.skuAttrs[0].name + ' | ' : ''} */}
                            {/* {prodcutItem.skuAttrs.length > 0 ? prodcutItem.skuAttrs[0].name : ''} */}
                            {this.contactProductAttr(prodcutItem.skaAttrs,prodcutItem.skuAttrs)}
                        </Text>
                        <Text style={styles.cardItemPrice}>{unit}{prodcutItem.sellPrice}</Text>
                        {prodcutItem.skuTotalTax ? <Text style={styles.textTax}>{I18n('COMMON.TEXT_TAX')}{prodcutItem.skuTotalTax}</Text> : null}
                    </View>
                </View>
                {/* {prodcutItem.quantity ? <Text style={styles.cardItemRightNum}>x{prodcutItem.quantity}</Text> : null} */}
                {prodcutItem.productCount ? <Text style={styles.cardItemRightNum}>x{prodcutItem.productCount}</Text> : null}
                {isRefunded ? <Text style={styles.refunded}>{I18n('ORDERDETAIL.STORE_REFUNDED')}</Text> : null}
            </View>
        )
    }
    contactProductAttr(data1, data2) {
        let list = [];

        data2 &&
            data2.map(data => {
                list.push(data.name);
            });
        return list.join(" | ");
    }
}


const styles = StyleSheet.create({
    cardListItem: {
        paddingTop: Constant.miniSize,
        backgroundColor: '#fff',
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    cardItemImg: {
        width: Utils.scale(83),
        height: Utils.scale(83),
        borderRadius: Utils.scale(5)
    },
    cardItemTitle: {
        width: Utils.scale(200),
        fontSize: Utils.scale(12),
        color: Constant.blackText
    },
    cardSubItemTitle: {
        width: Utils.scale(200),
        fontSize: Constant.smallSize,
        color: Constant.lightText,
        marginTop: Utils.scale(4),
    },
    cardItemPrice: {
        fontSize: Constant.smallSize,
        color: Constant.blackText,
        marginTop:Utils.scale(14),
    },
    textTax: {
        fontSize: Constant.smallSize,
        color: Constant.lightText,
        marginTop:Utils.scale(4),
    },
    refunded: {
        fontSize: Constant.smallSize,
        color: Constant.errorTxt,
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
    cardItemRightNum: {
        fontSize: Constant.smallSize,
        color: Constant.blackText,
        position: 'absolute',
        right: 16,
        top: 10
    },
})