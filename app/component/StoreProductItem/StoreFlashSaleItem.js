import React, { Component } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from "../OText/OText";
import ArrowRight from '../../res/img/arrow_right.png';
import I18n from "../../config/i18n";
import { Actions } from "react-native-router-flux";
import { END_STATE } from '../../store/FlashSaleStore';
import CountDown from "../Home/CountDown";
import SkipView from '../../component/StoreProductItem/SkipView';

const { width, height } = Dimensions.get('window');
import { inject, observer } from 'mobx-react/native';

@inject(stores => ({
    homeStore: stores.homeStore,
}))
@observer
export default class StoreFlashSaleItem extends Component {

    componentDidMount() {
        //this.getData()
    }

    getData() {
        this.props.homeStore.getFlashSaleList()
    }

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
        try {
            const { homeStore } = this.props;
            const { flashSaleData, } = homeStore;
            const { currentTime, startTime, endTime, items } = flashSaleData;
            let isStarted = currentTime > startTime
            let remainingTime = isStarted ? (endTime - currentTime) : (startTime - currentTime);
            if (items && items.length > 0) {
                return (<View>
                    <TouchableOpacity
                        style={styles.layRow}
                        onPress={() => this.pressTitle()}
                    >
                        <Text style={styles.textTitle}>{I18n('TODAY_FLASH_SALE')}</Text>
                        <Image style={styles.arrowRight} source={ArrowRight} />
                    </TouchableOpacity>

                    <View style={{
                        alignItems: "flex-start",
                        paddingLeft: Utils.scale(16),
                        marginTop: Utils.scale(15),
                        marginBottom: Utils.scale(20)
                    }}
                    >
                        <CountDown
                            remainingTime={remainingTime}
                            isStarted={isStarted}
                            onEndFun={() => {
                                this.getData();
                            }}
                        />
                    </View>
                    {this.renderList(items)}
                    <SkipView />
                </View>
                )
            } else {
                return <View />
            }
        } catch (error) {
            return <View />
        }
    }


    renderList(items) {
        return <View style={styles.flashView}>
            {items.map((obj, i) => {
                if (items.length >= 6 && i >= 6) {
                    return null
                } else if (items.length < 6 && i >= 3) {
                    return null
                }
                return this.renderFlashItem(obj)
            })}
        </View>

    }


    renderFlashItem(item, index) {
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
                key={productId + '' + index}
                style={{ marginBottom: Utils.scale(8), marginRight: Utils.scale(5),marginLeft: Utils.scale(10), }}
            >
                <View
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
        fontSize: Utils.scaleFontSizeFunc(24),
        fontWeight: 'bold',
        marginLeft: Utils.scale(16),
        marginTop: Utils.scale(20)
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
    arrowRight: {
        width: Utils.scale(14),
        height: Utils.scale(14),
        marginRight: Utils.scale(16),
        marginTop: Utils.scale(25),
    },
    flashSellImg: {
        width: Utils.scale(98),
        height: Utils.scale(98),
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
    },
    flashView: {
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    }
});




