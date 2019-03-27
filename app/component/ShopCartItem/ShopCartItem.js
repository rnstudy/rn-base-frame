import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DEC_ICON from '../../res/img/cart_dec.png';
import ADD_ICON from '../../res/img/cart_add.png';
import DELETE_ICON from '../../res/img/cart_del.png';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import OText from '../../component/OText/OText'
import Button from '../Button';
import { toJS } from 'mobx';

const { width, height } = Dimensions.get('window');
export default class ShopCartItem extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
        }
    }

    pressItem() {
        const { sku } = this.props.data;
        Actions.push('GoodsDetail', { productId: sku })
    }

    limitView() {
        const {
            spgMaximum,
            spgMinimum,
        } = this.props.data;
        let limitMin = null;
        let limitMax = null;

        if (spgMinimum && spgMinimum > 1) {
            limitMin = <View style={styles.limView}>
                <OText
                    style={[styles.limText]}
                    text={'CART.CART_LIMIT_MIN'}
                    option1={{ num: spgMinimum }}
                />
            </View >
        }
        if (spgMaximum && spgMaximum <= 20) {
            limitMax = <View style={styles.limView}>
                <OText
                    style={[styles.limText,]}
                    text={'CART.CART_LIMIT_MAX'}
                    option1={{ num: spgMaximum }}
                />
            </View>
        }
        if (limitMin || limitMax) {
            return <View style={styles.lim}>
                {limitMin}
                {limitMax}
            </View>
        }
        return <View />
    }

    //渲染
    render() {
        const {
            photoUrl,
            commodityName,
            propertysList,
            sellPrice,
            quantity,
            spgMaximum,
            spgMinimum,
        } = this.props.data;
        const { unit, pressAdd, pressDecrease, pressDelete } = this.props;
        let attrsStr = '';
        let maxLimit = false;
        let minLimit = false;
        if (quantity >= 20 || (spgMaximum > 0 && spgMaximum <= quantity)) {
            maxLimit = true;
        }
        if (spgMinimum > 1 && spgMinimum >= quantity) {
            minLimit = true;
        }
        if (propertysList && propertysList.length > 0) {
            for (const iterator of propertysList) {
                const { value } = iterator
                if (attrsStr !== '') {
                    attrsStr += '|'
                }
                attrsStr += value
            }
        }
        let imageUrl = photoUrl && photoUrl + '' !== '' ? photoUrl : null;
        return (
            <View>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => this.pressItem()}
                    >
                        <View
                            style={styles.imgView}
                        >
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.imgStyle}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.detailView}>
                        <Text
                            numberOfLines={2}
                            style={styles.nameText}
                        >{commodityName}</Text>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={styles.attrsText}
                        >{attrsStr}</Text>
                        <View style={{ flex: 1 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <Text style={styles.priceText}>
                                {unit}{sellPrice}
                            </Text>
                            <View style={styles.quantityView}>
                                <Button
                                    onPress={() => pressDecrease && pressDecrease()}
                                    disabled={minLimit}
                                >
                                    <Image
                                        source={DEC_ICON}
                                        style={[styles.shareImage, { opacity: !minLimit ? 1 : 0.4 }]}
                                    />
                                </Button>
                                <View style={styles.quantityTextView}>
                                    <Text style={styles.quantityText}>{quantity}</Text>
                                </View>
                                <Button
                                    disabled={maxLimit}
                                    onPress={() => pressAdd && pressAdd()}
                                >
                                    <Image
                                        source={ADD_ICON}
                                        style={[styles.shareImage, { opacity: !maxLimit ? 1 : 0.4 }]}
                                    />
                                </Button>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => pressDelete && pressDelete()}
                        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                    >
                        <Image
                            source={DELETE_ICON}
                            style={styles.delImg}
                        />
                    </TouchableOpacity>
                </View >
                {this.limitView()}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        marginTop: Utils.scale(20),
        height: Utils.scale(84),
        width: '100%',
        flexDirection: 'row',
    },
    imgView: {
        width: Utils.scale(84),
        height: Utils.scale(100),
        borderRadius: Utils.scale(4),
    },
    imgStyle: {
        width: Utils.scale(84),
        height: Utils.scale(84),
        borderRadius: Utils.scale(4),
        justifyContent: 'flex-end'
    },
    detailView: {
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        flex: 1,
        height: '100%'
    },
    priceText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        fontWeight: 'bold',
        color: Constant.blackText,
    },
    orgText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.lightText,
        textDecorationLine: 'line-through'
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
        paddingLeft:Utils.scale(100),
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
