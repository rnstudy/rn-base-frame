import React, { PureComponent } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from "../OText/OText";
import ArrowRight from '../../res/img/arrow_right.png';
import { Actions } from "react-native-router-flux";
import I18n from "../../config/i18n";
import ExpressTag from "../Widget/ExpressTag";

export default class NewsListItem extends PureComponent {

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
        return (<View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.toDailyNewList()}>
                <View style={styles.layRow}>
                    <Text style={styles.textTitle}>{I18n('TODAY_WHAT_NEW')}</Text>
                    <Image style={styles.arrowRight} source={ArrowRight} />
                </View>
            </TouchableOpacity>
            <FlatList
                data={items}
                renderItem={({ item }) => this.renderFlashItem(item)}
                horizontal={true}
                style={{ paddingLeft: 4 }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
        )
    }

    renderFlashItem(item) {
        const { productId, commission, unit, logisticsType } = item;
        return (
            <TouchableOpacity
                onPress={() => this.pressItem(productId)}
            // disabled={soldOut}
            >
                <View
                    style={{ paddingLeft: 12 }}
                >
                    <Image source={{ uri: item.productImg }} style={styles.flashSellImg} />
                    <View style={styles.layPrice}>
                        <Text style={styles.textSellPrice}>{unit}{item.sellPrice}</Text>
                    </View>
                    {commission && commission + '' !== '0' ? <OText
                        style={styles.bonusText}
                        text={'EARN'}
                        option1={{ unit, commission }}
                    /> : <View style={styles.bonusView} />}
                    <View style={{  marginTop: Utils.scale(4) }}>
                        <ExpressTag logisticsType={logisticsType} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    toDailyNewList() {
        Actions.push('DailyNewList', {
        })
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
        marginTop: Utils.scale(20),
        marginBottom: Utils.scale(16)
    },
    arrowRight: {
        width: Utils.scale(14),
        height: Utils.scale(14),
        marginRight: Utils.scale(16)
    },
    flashSellImg: {
        width: Utils.scale(140),
        height: Utils.scale(177),
        borderRadius: Utils.scale(4),
    },
    textSellPrice: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(16),
        fontWeight: 'bold',
    },
    textMarketPrice: {
        color: Constant.lightText,
        fontSize: Utils.scaleFontSizeFunc(12),
    },
    bonusText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(4),
    },
    bonusView: {
        marginTop: Utils.scale(18),
    },
});




