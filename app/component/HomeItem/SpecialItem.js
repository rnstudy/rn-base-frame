import React, { PureComponent } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OText from '../../component/OText/OText';
import SHARE_ICON from '../../res/img/share_gray.png';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import AppSetting from "../../store/AppSetting";
import ShopStore from "../../store/ShopStore";

export default class SpecialItem extends PureComponent {

    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
        }
    }

    pressItem(sku) {
        if (this.props.pressItem) {
            this.props.pressItem()
        } else {
            Actions.push('GoodsDetail', { productId: sku })
        }
    }

    //渲染
    render() {
        const { item, unit } = this.props;
        const {
            photo,
            commission,
            skuName,
            sellPrice,
            sku,
            limitSellMax,
            recommend,
            marketPrice,
            status
        } = item;
        let soldOut = limitSellMax + '' === '0' || status + '' === '1'
        let soldOutView = soldOut ? <View style={styles.soldOutViewStyle}>
            <View style={styles.soldOutBg}>
                <OText
                    text={'STORE_MANAGE_SALE_OUT'}
                    style={styles.soldOutText}
                />
            </View>
        </View> : null
        return (
            <TouchableOpacity
                key={sku}
                style={styles.container}
                onPress={() => this.pressItem(sku)}
                disabled={soldOut}
                activeOpacity={1}
            >
                <View style={styles.viewStyle}>
                    <View>
                        {photo && photo + '' !== '' ? <Image
                            source={{ uri: photo }}
                            style={styles.imgStyle}
                        /> : <View style={styles.imgStyle} />}
                        {soldOutView}
                    </View>
                    <Text
                        numberOfLines={2}
                        style={styles.recommendText}
                    >{skuName}</Text>
                    <Text
                        numberOfLines={2}
                        style={styles.detailText}
                    >{recommend}</Text>
                    <View style={styles.priceView}>
                        <Text style={styles.priceText}>{unit}{sellPrice}</Text>
                    </View>
                    {commission && commission + '' !== '0' ? <OText
                        style={styles.bonusText}
                        text={'EARN'}
                        option1={{ unit, commission }}
                    /> : <View style={styles.bonusView} />}
                </View>

            </TouchableOpacity>
        );
    }

    openShare(itemData) {
        const shareData = Utils.setShareData(
            ShopStore.storeInfo,
            itemData,
            AppSetting.BaseUrl,
            AppSetting.getCurrentLanguage.code,
            this.props.unit
        )
        this.refs.ShareModal.openModal(shareData)
    }
};

const styles = StyleSheet.create({
    container: {
        width: '50%',
    },
    viewStyle: {
        marginTop: Utils.scale(16),
        marginBottom: Utils.scale(20),
        margin: Utils.scale(16),
    },
    imgStyle: {
        width: Utils.scale(163),
        height: Utils.scale(163),
        borderRadius: Utils.scale(4),
    },
    priceView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: Utils.scale(8),
    },
    priceText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        fontWeight: 'bold',
        color: Constant.blackText,
        width: '60%'
    },
    shareImage: {
        width: Utils.scale(16),
        height: Utils.scale(16),
    },
    bonusText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(4),
    },
    bonusView: {
        marginTop: Utils.scale(18),
    },
    recommendText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(13),
        marginTop: Utils.scale(8),
    },
    detailText: {
        color: Constant.lightText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(8),
    },
    soldOutViewStyle: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    soldOutBg: {
        width: Utils.scale(80),
        height: Utils.scale(80),
        borderRadius: Utils.scale(40),
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
