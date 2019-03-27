import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    Platform,
    Text
} from 'react-native';

const { width, height } = Dimensions.get('window');
import SHARE_ICON from '../../res/img/share_gray.png';
import DELETE_ICON from '../../res/img/delete.png';

import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import ImageView from '../../component/ImageView/ImageView';
import OText from '../OText/OText';

export default class CartItemSoldOut extends Component {

    //构造函数
    constructor(props) {
        super(props);
        this.state = { //状态机变量声明
        }
    }

    //渲染
    render() {
        const { unit, data } = this.props;
        const {
            photoUrl,
            commodityName,
            propertysList,
            sellPrice,
            stock,
            spgMinimum
        } = data;

        let attrsStr = '';

        if (propertysList && propertysList.length > 0) {
            for (const iterator of propertysList) {
                const { value } = iterator
                if (attrsStr != '') {
                    attrsStr += '|'
                }
                attrsStr += value
            }
        }

        return (
            <View style={styles.container}>
                <ImageView
                    source={{ uri: photoUrl || '' }}
                    style={styles.imgStyle}
                />
                <View style={styles.detailView}>
                    <Text
                        numberOfLines={2}
                        style={styles.nameText}
                    >{commodityName}</Text>
                    <Text
                        style={styles.attrsText}
                    >{attrsStr}</Text>

                    <View style={{ flex: 1 }} />
                    {stock > 0 && stock >= spgMinimum &&
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <Text style={styles.priceText}>
                                {unit}{sellPrice}
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.addAgainFun && this.props.addAgainFun()
                                }
                            >
                                <OText
                                    text="DETAIL_ADD_CART"
                                    style={styles.addText}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
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
    },
    addText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(14),
    }
});
