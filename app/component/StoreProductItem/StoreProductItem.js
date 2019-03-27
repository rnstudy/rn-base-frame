import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    Alert,
    Text
} from 'react-native';
import CommonWebView, {
    NAVIGATION_SUSPENSION,
    NAVIGATION_BACK,
    NAVIGATION_HIDE
} from '../../pages/CommonWebView/CommonWebView'
const { width, height } = Dimensions.get('window');
import SHARE_ICON from '../../res/img/store_more.png';
import { Actions } from 'react-native-router-flux';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from '../../component/OText/OText';
import { inject, observer } from 'mobx-react/native';
import I18n from '../../config/i18n'
import AppSetting from "../../store/AppSetting";
import SkipView from './SkipView';
import ExpressTag from '../../component/Widget/ExpressTag'

@inject(stores => ({
    shopStore: stores.shopStore,
}))
@observer
export default class StoreProductItem extends Component {

    //默认属性
    static defaultProps = {
        data: {
            brandName: "tres corredores",
            category: "1",
            commission: 9.99,
            discount: "6.7",
            isSoldOut: 1,
            marketPrice: 99.9,
            productId: "V0000897403",
            productImg: "https://product-img.shuqian123.com/product/V0000897403-1-368X464-1504158171849.jpg",
            productName: "DALIAOTIAO_商品14-01_418",
            sellPrice: 66.6,
            unit: "$"
        }
    };

    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
        }
    }


    pressItem(productId) {
        Actions.push('GoodsDetail', { productId })
    }

    pressDelete(productId) {

    }

    //渲染
    render() {
        const {
            productImg,
            commission,
            productName,
            unit,
            sellPrice,
            productId,
            isSoldOut,
            logisticsType
        } = this.props.data;
        const showShowOut = isSoldOut + '' === '0';

        return (
            <TouchableOpacity
                style={styles.touchStyle}
                onPress={() => this.pressItem(productId)}
            >
                <View style={styles.container}>
                    {/* 图片 */}
                    <View style={styles.imgStyle}>
                        <Image
                            source={{ uri: productImg }}
                            style={[styles.imgStyle, { opacity: showShowOut ? 0.5 : 1 }]}
                        />
                        {showShowOut && <View style={styles.soldOutView}>
                            <OText
                                style={styles.soldOutText}
                                text={'STORE_DETAIL_SOLD_OUT'}
                            />
                        </View>}
                    </View>

                    {/* 标题 */}
                    <Text
                        numberOfLines={2}
                        style={[styles.nameText, showShowOut ? styles.grayText : {}]}
                    >{productName}</Text>

                    {/* 价格 */}
                    <View style={styles.priceView}>
                        <Text style={[styles.priceText, showShowOut ? styles.grayText : {}]}>
                            {unit}{sellPrice}  <OText
                                style={[styles.bonusText, showShowOut ? styles.grayText : {}]}
                                text={'EARN'}
                                option1={{ unit, commission }}
                            />
                        </Text>
                    </View>

                    {/* 极速达tag */}
                    <View style={{ paddingBottom: Utils.scale(14) }}>
                        {/* {isExpress && <ExpressTag />} */}
                        <ExpressTag logisticsType={logisticsType} />
                    </View>

                    {/* 点点点 */}
                    <TouchableOpacity
                        style={{ position: 'absolute', right: Utils.scale(20), bottom: Utils.scale(20) }}
                        onPress={() => this.props.pressShare && this.props.pressShare()}>
                        <Image
                            source={SHARE_ICON}
                            style={styles.shareImage}
                        />
                    </TouchableOpacity>

                </View>
                <SkipView />
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    touchStyle: {
        width: '100%',
    },
    container: {
        width: '100%',
        // height: '100%',
        backgroundColor: 'white',
        padding: Utils.scale(20),
        paddingBottom: Utils.scale(0),
    },
    imgStyle: {
        width: Utils.scale(335),
        height: Utils.scale(335),
        borderRadius: Utils.scale(12),
    },
    detailView: {
        paddingTop: Utils.scale(16),
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        flex: 1,
        height: '100%'
    },
    priceText: {
        fontSize: Utils.scaleFontSizeFunc(26),
        fontWeight: 'bold',
        color: Constant.blackText,
        // marginTop: Utils.scale(12),
        width: '60%',
    },
    bonusText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(14),
    },
    btnView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    priceView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: Utils.scale(10),
    },
    shareImage: {
        width: Utils.scale(22),
        height: Utils.scale(22),
        marginLeft: Utils.scale(16),
    },
    soldOutText: {
        color: 'white',
        fontSize: Utils.scaleFontSizeFunc(13),
        marginTop: Utils.scale(12),
    },
    soldOutView: {
        width: Utils.scale(200),
        height: Utils.scale(200),
        borderRadius: Utils.scale(100),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: Utils.scale(68),
        left: Utils.scale(68),
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(15),
        marginTop: Utils.scale(16),
    },
    grayText: {
        color: Constant.lightText
    }
});
