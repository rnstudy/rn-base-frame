import React, { PureComponent } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from "../OText/OText";
import ArrowRight from '../../res/img/arrow_right.png';
import Express from '../../res/img/icon_express.png';
import { Actions } from "react-native-router-flux";
import I18n from "../../config/i18n";
import ExpressTag from "../Widget/ExpressTag";

export default class HighBonusItem extends PureComponent {

    pressItem(productId) {
        if (this.props.pressItem) {
            this.props.pressItem()
        } else {
            Actions.push('GoodsDetail', { productId })
        }
    }

    //渲染
    render() {
        const { items } = this.props;
        let viewStyle = styles.wrapRow;
        if (items.length === 1) {
            viewStyle = [styles.wrapRow, { height: Utils.scale(130), }];
        } else if (items.length === 2) {
            viewStyle = [styles.wrapRow, { height: Utils.scale(240), }];
        }
        return (<View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.toHighBonusList()}>
                <View style={styles.layRow}>
                    <Text style={styles.textTitle}>{I18n('TODAY_HIGH_BONUS')}</Text>
                    <Image style={styles.arrowRight} source={ArrowRight} />
                </View>
            </TouchableOpacity>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={viewStyle}>
                    {items.map((item, index) => this.renderFlashItem(item, index))}
                </View>
            </ScrollView>
        </View>
        )
    }

    renderFlashItem(item, index) {
        const { productId, commission, unit, logisticsType } = item;
        return (
            <TouchableOpacity
                key={index}
                onPress={() => this.pressItem(productId)}
                key={index + '' + productId}
            >
                <View style={styles.layItemRow}>
                    <Image source={{ uri: item.productImg }} style={styles.flashSellImg} />
                    <View>
                        <Text numberOfLines={2} style={styles.textProduceName}>{item.productName}</Text>
                        <Text style={styles.textSellPrice}>{unit}{item.sellPrice}</Text>
                        {commission && commission + '' !== '0' ? <OText
                            style={styles.bonusText}
                            text={'EARN'}
                            option1={{ unit, commission }}
                        /> : <View style={styles.bonusView} />}
                        <View style={{ position: 'absolute', bottom: Utils.scale(0) }}>
                            <ExpressTag logisticsType={logisticsType} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    toHighBonusList() {
        Actions.push('HighBonusList')
    }
};

const styles = StyleSheet.create({

    wrapRow: {
        height: Utils.scale(360),
        flexWrap: 'wrap',
        alignItems: 'center',
    },
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
        marginTop: Utils.scale(40),
        marginBottom: Utils.scale(1),
    },
    layItemRow: {
        width: Utils.scale(300),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Utils.scale(8),
        marginBottom: Utils.scale(8),
        marginLeft: Utils.scale(12),
        height: Utils.scale(104),
    },
    arrowRight: {
        width: Utils.scale(14),
        height: Utils.scale(14),
        marginRight: Utils.scale(16)
    },
    flashSellImg: {
        width: Utils.scale(83),
        height: Utils.scale(104),
        marginRight: Utils.scale(12),
        borderRadius: Utils.scale(4),
    },
    textSellPrice: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(16),
        fontWeight: 'bold',
        marginTop: Utils.scale(4)
    },
    textProduceName: {
        width: Utils.scale(200),
        // height: Utils.scale(26),
        color: Constant.lightText,
        marginRight: Utils.scale(10),
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(1)
    },
    bonusText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(2),
    },
    bonusView: {
        marginTop: Utils.scale(18),
    },
});




