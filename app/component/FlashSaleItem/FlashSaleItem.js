import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OText from '../../component/OText/OText';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';

import { END_STATE } from '../../store/FlashSaleStore';
import { toJS } from 'mobx';
import ExpressTag from "../Widget/ExpressTag";

const { width, height } = Dimensions.get('window');

export default class FlashSaleItem extends Component {


    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
        }
    }

    pressItem(productId) {
        if (this.props.pressItem) {
            this.props.pressItem()
        } else {
            Actions.push('GoodsDetail', { productId })
        }
    }

    //渲染
    render() {
        const { timeState, item } = this.props;
        const {
            productImg,
            discount,
            productName,
            unit,
            flashSalePrice,
            productId,
            marketPrice,
            productCount,
            productRemaining,
            isSoldOut,
            logisticsType
        } = item;

        let soldPs = isSoldOut + '' === '0' || productRemaining <= 0 ? 100 : parseInt(((1 - (productRemaining / productCount)) * 100))
        let psView = [styles.lineBg, { backgroundColor: Constant.themeText, width: soldPs + '%', marginTop: 0 }]
        let discountText = '-' + parseInt((10 - discount) * 10) + "%";
        let soldOut = isSoldOut + '' === '0' || productRemaining <= 0;
        let isEnd = timeState === END_STATE;
        let soldOutView = isEnd ? <View style={styles.soldOutViewStyle}>
            <View style={styles.soldOutBg}>
                <OText
                    text={'STORE_FLASHSALE_END'}
                    style={styles.soldOutText}
                />
            </View>
        </View> : soldOut ? <View style={styles.soldOutViewStyle}>
            <View style={styles.soldOutBg}>
                <OText
                    text={'STORE_FLASHSALE_SOLDOUT'}
                    style={styles.soldOutText}
                />
            </View>
        </View> : null;

        let propotion = soldPs + "%";
        let showMarketPrice = marketPrice && marketPrice > flashSalePrice;

        return (
            <TouchableOpacity
                key={productId}
                style={styles.container}
                onPress={() => this.pressItem(productId)}
                disabled={soldOut}
            >
                <View style={styles.viewStyle}>
                    <View style={styles.imgView}>
                        {productImg && productImg + '' !== '' ? <Image
                            source={{ uri: productImg }}
                            style={styles.imgStyle}
                        /> : <View style={styles.imgStyle} />}
                        {soldOutView}
                    </View>

                    <View style={styles.detailStyle}>
                        <Text
                            numberOfLines={1}
                            style={styles.detailText}
                        >{productName}</Text>
                        <View style={styles.priceView}>
                            <Text style={styles.priceText}>{unit}{flashSalePrice}  {showMarketPrice && <Text style={styles.marketText}>{unit}{marketPrice}</Text>}
                            </Text>
                        </View>

                        <View style={{ paddingTop: Utils.scale(4) }}>
                            <ExpressTag logisticsType={logisticsType} />
                        </View>

                        <View style={{ position: 'absolute', bottom: Utils.scale(24), width: Utils.scale(217) }}>
                            <View style={styles.presentView}>
                                <View/>
                                {showMarketPrice && <View style={styles.discountView}>
                                    <Text style={styles.discountText}>
                                        {discountText}
                                    </Text>
                                </View>}
                            </View>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        );

    }
};

const styles = StyleSheet.create({
    container: {
        width: width - Utils.scale(32),
        borderRadius: 4,
        backgroundColor: 'white',
        marginLeft: Utils.scale(16),
        marginTop: Utils.scale(16),
        height: Utils.scale(140),
    },
    viewStyle: {
        flexDirection: 'row',
        borderRadius: 4
    },
    imgView: {
        width: Utils.scale(110),
        height: Utils.scale(140),
        borderRadius: 4
    },
    imgStyle: {
        width: Utils.scale(110),
        height: Utils.scale(140),
        borderRadius: 4
    },
    detailStyle: {
        height: '100%',
        width: Utils.scale(216),
        margin: Utils.scale(16),
        marginRight: 0,
    },
    priceView: {
        flexDirection: 'row',
        width: '100%',
        height: Utils.scale(22),
        marginTop: Utils.scale(8),
    },
    lineBg: {
        width: Utils.scale(135),
        height: Utils.scale(4),
        borderRadius: Utils.scale(2),
        backgroundColor: "#d8d8d8",
        marginTop: Utils.scale(4),
    },
    priceText: {
        fontSize: Utils.scaleFontSizeFunc(18),
        fontWeight: 'bold',
        color: Constant.blackText,
        minWidth: '100%'
    },
    presentText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.lightText,
    },
    marketText: {
        fontSize: Utils.scaleFontSizeFunc(13),
        color: Constant.lightText,
        textDecorationLine: 'line-through',
    },
    presentView: {
        // marginTop: Utils.scale(23),
        // position: 'absolute',
        // bottom: Utils.scale(0),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    discountView: {
        width: Utils.scale(60),
        height: Utils.scale(28),
        backgroundColor: Constant.themeText,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: Utils.scale(14),
        borderBottomLeftRadius: Utils.scale(14),
        borderTopRightRadius: 1,
        borderBottomRightRadius: 1,
    },
    discountText: {
        color: 'white',
        fontSize: Utils.scaleFontSizeFunc(14),
        fontWeight: 'bold',
        width: '90%',
        textAlign: 'center',
    },
    detailText: {
        color: Constant.lightText,
        fontSize: Utils.scaleFontSizeFunc(12),
        // width: '85%'
        paddingRight: Utils.scale(8),
    },
    soldOutViewStyle: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 4
    },
    soldOutBg: {
        width: Utils.scale(80),
        height: Utils.scale(80),
        borderRadius: Utils.scale(40),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
