import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    Text
} from 'react-native';
import OText from '../../component/OText/OText';

const { width, height } = Dimensions.get('window');
import SHARE_ICON from '../../res/images/share_icon.png';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import AppSetting from "../../store/AppSetting";
import Toast from '../../component/Toast'
import I18n from '../../config/i18n'
import { inject, observer } from 'mobx-react/native';
import ShareModal from "../ShareModal/ShareModal";
import ShopStore from "../../store/ShopStore";
import SplitLine from "../../component/NewHome/SplitLine";
@inject(stores => ({
    detailStore: stores.goodsDetailStore,
}))
@observer
export default class HomeItem extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
            addStore: false,
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
        let imgUrl = photo;

        let showShare = true;
        let soldOutView = soldOut ? <View style={styles.soldOutViewStyle}>
            <View style={styles.soldOutBg}>
                <OText
                    text={'STORE_MANAGE_SALE_OUT'}
                    style={styles.soldOutText}
                />
            </View>
        </View> : null
        let marketPriceView = marketPrice > 0 && marketPrice > sellPrice ? <Text style={styles.marketPrice}> {unit}{marketPrice}</Text> : null
        return (
            <TouchableOpacity
                activeOpacity={1}
                key={sku}
                style={styles.container}
                onPress={this.props.onSelectItem ? this.props.onSelectItem : () => this.pressItem(sku)}
            >
                <View style={styles.viewStyle}>
                    <View style={styles.imgView}>
                        {imgUrl && imgUrl + '' !== '' ? (
                            <Image
                                source={{ uri: imgUrl }}
                                style={styles.imgStyle}
                            />) : (
                                <View style={styles.imgStyle} />
                            )}
                        {soldOutView}
                    </View>

                    <View style={{ height: '100%', flex: 1 }}>

                        {recommend && recommend != '' ? <Text
                            numberOfLines={2}
                            style={styles.detailText}
                        >{recommend}</Text> : <View />}
                        <Text
                            numberOfLines={2}
                            style={styles.reText}
                        >{skuName}</Text>
                        <View>
                            <View style={styles.priceView}>
                                <Text style={styles.priceText}>{unit}{sellPrice}{marketPriceView}</Text>
                            </View>
                            {commission && commission + '' !== '0' ? <OText
                                style={styles.bonusText}
                                text={'EARN'}
                                option1={{ unit, commission }}
                            /> : <View style={styles.bonusView} />}
                        </View>


                        {!soldOut ?
                            <View style={styles.shareView}>
                                {showShare ?
                                    <TouchableOpacity
                                        hitSlop={{ top: 20, left: 5, bottom: 20, right: 20 }}
                                        onPress={() => this.openShare(this.props.item)}
                                    >
                                        <Image
                                            source={SHARE_ICON}
                                            style={styles.shareImage}
                                        />
                                    </TouchableOpacity> : null
                                }

                            </View> : <View style={styles.shareImage} />
                        }
                    </View>
                </View>
                <ShareModal
                    ref={"ShareModal"}
                />
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
        width: '100%',
    },
    viewStyle: {
        margin: Utils.scale(16),
        marginTop: Utils.scale(16),
        marginBottom: Utils.scale(4),
        flexDirection: 'row',
    },
    imgView: {
        width: Utils.scale(140),
        height: Utils.scale(140),
        marginRight: Utils.scale(16),
    },
    imgStyle: {
        width: Utils.scale(140),
        height: Utils.scale(140),
        borderRadius: Utils.scale(4),
    },
    priceView: {
        flexDirection: 'row',
        width: '100%',
        // height: Utils.scale(22),
        justifyContent: 'space-between',
        marginTop: Utils.scale(8),
    },
    priceText: {
        fontSize: Utils.scaleFontSizeFunc(20),
        fontWeight: 'bold',
        color: Constant.blackText,
    },
    marketPrice: {
        textDecorationLine: 'line-through',
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.lightText,
    },
    shareImage: {
        width: Utils.scale(22),
        height: Utils.scale(22),
        marginLeft: Utils.scale(22),
    },
    shareView: {
        flexDirection: 'row',
        position: 'absolute',
        right: Utils.scale(8),
        bottom: Utils.scale(0),
    },
    bonusText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginTop: Utils.scale(1),
    },
    bonusView: {
        marginTop: Utils.scale(18),
    },
    detailText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(16),
        marginTop: Utils.scale(8),
    },
    reText: {
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
