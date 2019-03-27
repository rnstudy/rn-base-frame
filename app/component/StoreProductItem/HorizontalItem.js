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
import ExpressTag from '../../component/Widget/ExpressTag'
@inject(stores => ({
    shopStore: stores.shopStore,
}))
@observer
export default class HorizontalItem extends Component {

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
        Alert.alert('', I18n('CART_DELETE'),
            [{ text: I18n('CART_DELETE_NO'), },
            { text: I18n('CART_DELETE_YES'), onPress: () => this.props.shopStore.takeOffSelves([productId]) }
            ])
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
            logisticsType,
            showMaxHeight,
        } = this.props.data;
        const showShowOut = isSoldOut + '' === '0';
        const bottomViewStyle = showMaxHeight ? { height: Utils.scale(25) } : null;

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

                    <View style={{ padding: Utils.scale(8) }}>
                        {/* 标题 */}
                        <Text
                            numberOfLines={2}
                            style={[styles.nameText, showShowOut ? styles.grayText : {}]}
                        >{productName}</Text>

                        {/* 价格 */}
                        <View style={styles.priceView}>
                            <View>
                                <Text style={[styles.priceText, showShowOut ? styles.grayText : {}]}>{unit}{sellPrice}
                                </Text>
                                <OText
                                    style={[styles.bonusText, showShowOut ? styles.grayText : {}]}
                                    text={'EARN'}
                                    option1={{ unit, commission }}
                                />
                            </View>
                        </View>

                        {/* 极速达Tag */}
                        <View style={[bottomViewStyle, { marginBottom: Utils.scale(8) }]}>
                            {/* {isExpress && <ExpressTag />} */}
                            <ExpressTag logisticsType={logisticsType} />
                        </View>

                        {/* 点点点 */}
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                right: Utils.scale(8),
                                bottom: showMaxHeight ? Utils.scale(14) : Utils.scale(16)
                            }}
                            onPress={() => this.props.pressShare && this.props.pressShare()}>
                            <Image
                                source={SHARE_ICON}
                                style={styles.shareImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    touchStyle: {
        // height: Utils.scale(250),
        width: Utils.scale(158),
        height: '100%',
        marginLeft: Utils.scale(8),
        marginRight: Utils.scale(8),
        backgroundColor: 'white',
        borderRadius: Utils.scale(8),
        shadowColor: 'rgba(0,0,0,0.6)',
        shadowRadius: 3,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 0 },
        //让安卓拥有灰色阴影
        elevation: 8,
        zIndex: Utils.isIOS() ? 1 : 0
    },
    container: {
        width: '100%',
        // height: '100%',
        // borderTopLeftRadius: Utils.scale(8),
        // borderTopRightRadius: Utils.scale(8),
        backgroundColor: 'white',
        borderRadius: Utils.scale(8),
    },
    imgStyle: {
        width: Utils.scale(158),
        height: Utils.scale(158),
        borderTopLeftRadius: Utils.scale(8),
        borderTopRightRadius: Utils.scale(8),
    },
    priceText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        fontWeight: 'bold',
        color: Constant.blackText,
        marginTop: Utils.scale(12),
        width: '100%',
    },
    bonusText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginLeft: 2,
        marginTop: 2
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
        justifyContent: 'space-between'
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
        width: Utils.scale(110),
        height: Utils.scale(110),
        borderRadius: Utils.scale(100),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: Utils.scale(24),
        left: Utils.scale(24),
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(12),
        // marginTop: Utils.scale(8),
        width: '100%',
        height: Utils.scale(30),
    },
    grayText: {
        color: Constant.lightText
    }
});
