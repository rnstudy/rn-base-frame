import React, { Component } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OText from '../OText/OText';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import CommonHeader from "../Header/CommonHeader";
import * as Api from "../../utils/Api";
import Utils from '../../utils/Utils';
import I18n from '../../config/i18n';

import OrderItemProduct from '../OrderListItem/OrderItemProduct';
import WarehouseTitle from './WarehouseTitle';

import HOUSE from '../../res/img/warehouse.png';


const { width, height } = Dimensions.get('window');

export default class ProductList extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { houseItem, unit,} = this.props;
        const { items, orderTotal, total,  originShippingCost } = houseItem;
        const freeShip = originShippingCost > 0
        try {
            return <CommonHeader
                title={I18n('CHECKOUT.CHECKOUT_PRODUCTLIST_TITLE', { num: items.length })}
            >
                <ScrollView>
                    {items.map((obj, i) => {
                        return <OrderItemProduct
                            key={i * 100}
                            prodcutItem={obj}
                            unit={unit}
                        />
                    })}
                    <View style={styles.priceView}>
                        <View style={styles.priceItem}>
                            <OText
                                text={'COMMON.CHECKOUT_SUBTOTAL'}
                                style={[styles.priceLeft, { fontSize: Utils.scaleFontSizeFunc(14) }]}
                            />
                            <Text style={[styles.priceRight, { fontSize: Utils.scaleFontSizeFunc(20) }]}>
                                {unit}{total}
                            </Text>
                        </View>
                    </View>

                </ScrollView>
            </CommonHeader>
        } catch (error) {
            console.log('--------', error);
            return <View />
        }

    }

    renderMoreWarehoust(productList) {
        if (productList.length > 1) {
            return <View style={styles.moreBg}>
                <OText
                    text={'CHECKOUT_PRODUCTLIST_TIPS'}
                    style={styles.moreText}
                />
            </View>
        }
        return <View />
    }

}

const styles = StyleSheet.create({
    wareText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(14),
        fontWeight: 'bold',
        width: '50%',
        marginLeft: Utils.scale(9),
    },
    moreText: {
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(12),
    },
    moreBg: {
        backgroundColor: '#f2f2f2',
        padding: Utils.scale(16),
    },
    priceView: {
        margin: Utils.scale(16),
    },
    priceItem: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    priceLeft: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.grayText,
    },
    priceRight: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.blackText,
    },
});
