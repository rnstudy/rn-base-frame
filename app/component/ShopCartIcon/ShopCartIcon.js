import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    View
} from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import OText from '../../component/OText/OText'
import { toJS } from 'mobx';
import CART from '../../res/images/cart.png'
import CountTime from '../../utils/CountTime';

import { inject, observer } from "mobx-react/native";

@inject(stores => ({
    shopCartStore: stores.shopCartStore,
}))
@observer
export default class ShopCartItem extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = {
        }
        //new CountTime().countDownAction(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    toCartPage() {
        if (this.props.press) {
            this.props.press()
        } else {
            Actions.push('ShopCart')
        }
    }

    renderNomalIcon() {
        return <TouchableOpacity onPress={() => {
            this.toCartPage()
        }}>
            <Image
                style={styles.imgView}
                source={CART}
            />
        </TouchableOpacity>
    }

    render() {
        try {
            const { shopCartStore, viewStyle } = this.props;
            const { timerCount, cartMsg } = shopCartStore;
            let goodsCount = null;
            let timeCountView = null;
            if (cartMsg && cartMsg.commodityTotal > 0) {
                goodsCount = <View style={styles.countView}>
                    <Text style={styles.countText}>{cartMsg.commodityTotal}</Text>
                </View>
                if (timerCount && timerCount > 0) {
                    timeCountView = <Text style={styles.orgText}>
                        {Utils.transformTime(timerCount).MM}:{Utils.transformTime(timerCount).SS}
                    </Text>
                }
            }
            return (
                <TouchableOpacity
                    onPress={() => this.toCartPage()}
                    style={[styles.container, viewStyle]}
                >
                    <Image
                        style={styles.imgView}
                        source={CART}
                    />
                    {goodsCount}
                    {timeCountView}
                </TouchableOpacity>
            );
        } catch (error) {
            return this.renderNomalIcon()
        }

    }
};

const styles = StyleSheet.create({
    container: {
        height: Utils.scale(40),
        flexDirection: 'row',
        alignItems: 'center'
    },
    imgView: {
        width: Utils.scale(22),
        height: Utils.scale(22),
    },
    countView: {
        width: Utils.scale(18),
        height: Utils.scale(18),
        borderRadius: Utils.scale(9),
        backgroundColor: Constant.themeText,
        alignItems: "center",
        justifyContent: 'center',
        position: 'absolute',
        left: Utils.scale(13),
        top: 0
    },
    countText: {
        fontSize: Utils.scaleFontSizeFunc(10),
        fontWeight: 'bold',
        color: 'white',
    },

    orgText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.themeText,
        marginLeft: Utils.scale(8),
    },
    bonusText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.lightText,
    },
    btnView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

    shareImage: {
        width: Utils.scale(22),
        height: Utils.scale(22),
    },

    nameText: {
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(13),
        width: Utils.scale(200),
    },
    attrsText: {
        color: Constant.lightText,
        fontSize: Utils.scaleFontSizeFunc(13),
        width: Utils.scale(200),
        marginTop: Utils.scale(5),
    },
    quantityView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        width: Utils.scale(84)
    },
    quantityTextView: {
        width: Utils.scale(20),
        alignItems: 'center',
        justifyContent: 'center',
        height: Utils.scale(20),
        marginLeft: Utils.scale(12),
        marginRight: Utils.scale(12),
        flex: 1
    },
    quantityText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        fontWeight: 'bold',
        color: Constant.blackText,
    },
    deleteBtn: {
        position: 'absolute',
        top: 2,
        right: Utils.scale(16),
    },
    delImg: {
        width: Utils.scale(10),
        height: Utils.scale(10),
    },
    lim: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: Utils.scale(100),
    },
    limView: {
        borderRadius: Utils.scale(8),
        width: Utils.scale(103),
        height: Utils.scale(16),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#666666",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Utils.scale(6),
    },
    limText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(10),
    },
    colorText: {
        color: Constant.themeText,
    }
});
