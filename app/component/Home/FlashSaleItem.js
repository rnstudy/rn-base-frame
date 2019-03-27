import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from "../OText/OText";
import ArrowRight from '../../res/img/arrow_right.png';
import I18n from "../../config/i18n";
import CountDown from "./CountDown";
import { Actions } from "react-native-router-flux";
import GoodsDetailFlash from "../GoodsDetailFlash/GoodsDetailFlash";
import { END_STATE } from '../../store/FlashSaleStore';
import { toJS } from 'mobx';

export default class FlashSaleItem extends Component {

    pressItem(productId) {
        if (this.props.pressItem) {
            this.props.pressItem()
        } else {
            Actions.push('GoodsDetail', { productId })
        }
    }

    pressTitle() {
        Actions.push('FlashSale')
    }

    //渲染
    render() {
        const { flashSaleData } = this.props;
        const { currentTime, startTime, endTime, items } = flashSaleData;
        let isStarted = currentTime > startTime
        let remainingTime = isStarted ? (endTime - currentTime) : (startTime - currentTime)

        if (items && items.length > 0) {
            return (<View>
                <TouchableOpacity
                    style={styles.layRow}
                    onPress={() => this.pressTitle()}
                >
                    <Text style={styles.textTitle}>{I18n('TODAY_FLASH_SALE')}</Text>
                    <View style={styles.layRowRight}>
                        <CountDown remainingTime={remainingTime} isStarted={isStarted}
                            onEndFun={() => {
                                this.props.onEndFun();
                            }} />
                        <Image style={styles.arrowRight} source={ArrowRight} />
                    </View>
                </TouchableOpacity>

                <FlatList
                    keyExtractor={(item, index) => (item.productId + '' + index)}
                    data={items}
                    renderItem={({ item }) => this.renderFlashItem(item)}
                    horizontal={true}
                    style={{ paddingLeft: 4 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator = {false}
                />
            </View>
            )
        } else {
            return null
        }
    }

    renderFlashItem(item) {
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
            commission
        } = item;
        let soldPs = isSoldOut + '' === '0' || productRemaining <= 0 ? 100 : parseInt(((1 - (productRemaining / productCount)) * 100))
        let soldOut = isSoldOut + '' === '0' || productRemaining <= 0;
        let isEnd = '' === END_STATE;
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
        return (
            <TouchableOpacity
                onPress={() => this.pressItem(productId)}
                disabled={soldOut}
            >
                <View
                    style={{ paddingLeft: 12 }}
                >
                    <View style={styles.flashSellImg}>
                        <Image
                            source={{ uri: item.productImg }}
                            style={styles.flashSellImg}
                        />
                        {soldOutView}
                    </View>

                    <View style={styles.layPrice}>
                        <Text style={styles.textSellPrice}>{unit}{flashSalePrice}</Text>
                        <Text style={styles.textMarketPrice}>{unit}{item.marketPrice}</Text>
                    </View>
                    {commission && commission + '' !== '0' ? <OText
                        style={styles.bonusText}
                        text={'EARN'}
                        option1={{ unit, commission }}
                    /> : <View style={styles.bonusView} />}
                </View>
            </TouchableOpacity>
        )
    }
};

const styles = StyleSheet.create({
    textTitle: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(18),
        fontWeight: 'bold',
        marginLeft: Utils.scale(16),
    },
    layPrice: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    layRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    layRowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: Utils.scale(20),
        marginBottom: Utils.scale(16),
    },
    arrowRight: {
        width: Utils.scale(14),
        height: Utils.scale(14),
        marginRight: Utils.scale(16),
        marginLeft: Utils.scale(6),
    },
    flashSellImg: {
        width: Utils.scale(190),
        height: Utils.scale(240),
        borderRadius: Utils.scale(4),
    },
    textSellPrice: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(20),
        fontWeight: 'bold',
    },
    textMarketPrice: {
        color: Constant.lightText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginLeft: Utils.scale(3),
        marginBottom: Utils.scale(2),
    },
    bonusText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(4),
    },
    bonusView: {
        marginTop: Utils.scale(18),
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




