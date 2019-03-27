import React, { Component } from "react";
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    InteractionManager,
    ActivityIndicator,
    Dimensions,
    Modal,
    Text,
    Image,
    TouchableOpacity,
    ScrollView
} from "react-native";

import OText from "../OText/OText";
import I18n, { priceTranslations } from "../../config/i18n";
import CLOSE_ICON from "../../res/img/navi_close.png";
import * as Constant from "../../utils/Constant";
import Utils from "../../utils/Utils";
const { width, height } = Dimensions.get("window");
import { inject, observer } from "mobx-react/native";
import DEC_ICON from "../../res/img/cart_dec.png";
import ADD_ICON from "../../res/img/cart_add.png";
import CustomToast, { FAIL } from "./Toast";
import Toast from "../../component/Toast";
import { toJS } from "mobx";

export default class GoodsDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showIndicator: false,
            modalVisible: false
        };
    }

    openModal() {
        if (!this.state.modalVisible) {
            InteractionManager.runAfterInteractions(() => {
                try {
                    this.setState({
                        modalVisible: true
                    });
                } catch (error) {
                    console.log("====openModal===", error);
                }
            });
        }
    }

    closeModal() {
        try {
            this.setState({
                showIndicator: false,
                modalVisible: false
            });
        } catch (error) { }
    }

    showToast(text) {
        this.refs.toast.show(text, null, null, FAIL);
    }

    showTips(text) {
        this.refs.toast.show(text, null, null, null);
    }

    showIndicator(isShow) {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                showIndicator: isShow
            });
        });
    }

    renderIndicator() {
        if (this.state.showIndicator) {
            return (
                <View style={styles.indicatorView}>
                    <ActivityIndicator color={Constant.themeText} />
                </View>
            );
        } else {
            return null;
        }
    }

    renderQuantity() {
        const { quantity, limitQuantityMax, limitQuantityMin, limitSellMax } = this.props;
        let text1 = null;
        let text2 = null;
        let limitText = null;
        let sellMaxView = limitSellMax < 6 ? <OText
            text={"CART.CART_LEFT"}
            style={styles.leftText}
            option1={{ num: limitSellMax }}
        /> : null
        if (limitQuantityMin && limitQuantityMin > 1) {
            text1 = <OText
                text={"DETAIL.PIECES_FOR_SALE"}
                style={styles.quantityTitle}
                option1={{ number: limitQuantityMin }}
            />
        }
        if (limitQuantityMax && limitQuantityMax <= 20) {
            text2 = <OText
                text={"DETAIL.PURCHASE_FOR_SALE"}
                style={styles.quantityTitle}
                option1={{ number: limitQuantityMax }}
            />
        }
        if (text1 != null && text2 != null) {
            limitText = <Text style={styles.quantityTitle}>
                ({text1},{text2})
                </Text>;
        } else if (text1) {
            limitText = <Text style={styles.quantityTitle}>
                ({text1})
                </Text>;
        } else if (text2) {
            limitText = <Text style={styles.quantityTitle}>
                ({text2})
                </Text>;
        }

        return (
            <View>
                <OText
                    text={"STORE_DETAIL_QUANTITY"}
                    style={styles.quantityTitle}
                >
                    {limitText}
                </OText>
                <View style={styles.btnView}>
                    <TouchableOpacity
                        onPress={() => this.changeQuantity(false)}
                        activeOpacity={quantity + "" !== "1" ? 0.2 : 1}
                    >
                        <Image
                            source={DEC_ICON}
                            style={styles.addImage}
                            opacity={quantity + "" !== "1" ? 1 : 0.4}
                        />
                    </TouchableOpacity>
                    <View style={styles.quantityTextView}>
                        <Text style={styles.quantityText}>{quantity}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.changeQuantity(true)}
                        activeOpacity={quantity < limitSellMax || quantity < limitQuantityMax ? 0.2 : 1}
                    >
                        <Image
                            source={ADD_ICON}
                            style={styles.addImage2}
                            opacity={quantity < limitSellMax || quantity < limitQuantityMax ? 1 : 0.4}
                        />
                    </TouchableOpacity>
                    {sellMaxView}
                </View>
            </View >
        );
    }

    renderDetail() {
        try {
            const { goodsData, quantity } = this.props;
            if (goodsData) {
                const { productInfo, unit, propertyList } = goodsData;
                const {
                    skuName,
                    photo,
                    sellPrice,
                    detailImages,
                } = productInfo;

                if (detailImages && detailImages.length > 0) {
                    productImg = detailImages[0].url;
                }
                return (
                    <View style={styles.touchBg}>
                        <TouchableOpacity
                            style={styles.touchCancel}
                            onPress={() => this.closeModal()}
                        >
                            <View />
                        </TouchableOpacity>
                        <View style={styles.viewStyle}>
                            <View style={styles.detailView}>
                                <Image
                                    style={styles.detailImage}
                                    source={{ uri: photo }}
                                />
                                <View style={styles.detailTextView}>
                                    <Text
                                        style={styles.detailText}
                                        numberOfLines={2}
                                    >
                                        {skuName}
                                    </Text>
                                    <View styles={styles.priceContainer}>
                                        <Text style={styles.sellText}>
                                            {unit}
                                            {sellPrice}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            {this.renderAttributeView(propertyList)}
                            <TouchableOpacity
                                onPress={() => this.props.addCartFun()}
                                style={styles.addBtn}
                            >
                                <View style={styles.addTextContainer}>
                                    <OText
                                        text={"DETAIL.STORE_DETAIL_ADD_TO_CART"}
                                        style={styles.addText}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => this.closeModal()}
                            >
                                <Image source={CLOSE_ICON} />
                            </TouchableOpacity>
                        </View>
                        {this.renderIndicator()}
                    </View>
                );
            } else {
                return <View />;
            }
        } catch (error) {
            console.log("=======renderDetailerror", error);
        }
    }

    renderAttributeView(attributeList) {
        const attrKey = Object.getOwnPropertyNames(attributeList);
        const { skuArray, productId } = this.props;
        if (attributeList) {
            return (
                <View
                    style={{
                        width: "100%",
                        height: Utils.scale(326)
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.scrollStyle}
                    >
                        <View
                            style={{
                                marginLeft: Utils.scale(16),
                                marginRight: Utils.scale(16)
                            }}
                        >
                            {attrKey.map((obj, index) => {
                                return (
                                    <View key={obj + "" + index}>
                                        <Text style={styles.descTitle}>
                                            {obj}
                                        </Text>
                                        <View style={styles.descView}>
                                            {attributeList[obj] &&
                                                attributeList[obj].length > 0 && attributeList[obj].map(
                                                    (item, itemIndex) => {
                                                        const { propertyValue, valueId } = item;
                                                        let isSel = skuArray[index] + '' === valueId + ''
                                                        let touchStyle = isSel ? [styles.descTouch, styles.descTouchSel] : styles.descTouch;
                                                        let textStyle = isSel ? styles.descSelText : styles.descDisText;
                                                        return (
                                                            <TouchableOpacity
                                                                key={propertyValue + valueId + itemIndex}
                                                                onPress={() => {
                                                                    this.pressDesc(index, item)
                                                                }}
                                                            >
                                                                <View
                                                                    style={touchStyle}
                                                                >
                                                                    <Text
                                                                        style={textStyle}
                                                                    >
                                                                        {propertyValue}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        );
                                                    }
                                                )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                        {this.renderQuantity()}
                    </ScrollView>
                </View>
            );
        } else {
            return this.renderQuantity();
        }
    }

    changeQuantity(isAdd) {
        this.props.changeQuantity(isAdd);
    }

    pressDesc(index, item) {
        this.showIndicator(true);
        this.props.changeAttr(index, item, () =>
            this.showIndicator(false)
        );
    }

    render() {
        return (
            <View styles={{ position: "releative" }}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { }}
                >
                    {this.renderDetail()}
                    <CustomToast ref="toast" />
                </Modal>
                {/* 黑色背景 */}
                {this.state.modalVisible && (
                    <View style={styles.bGOpc}>
                        <TouchableOpacity
                            style={styles.bGOpc}
                            onPress={() => this.closeModal()}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    },
    bGOpc: {
        position: "absolute",
        top: -height,
        left: 0,
        zIndex: -1,
        width: width,
        height: height,
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    },
    touchBg: {
        width: width,
        height: height,
        flex: 1
    },
    touchCancel: {
        width: "100%",
        flex: 1
        // height: Utils.scale(187)
    },
    viewStyle: {
        alignItems: "center",
        paddingTop: Utils.scale(17),
        width: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: Utils.scale(16),
        borderTopRightRadius: Utils.scale(16),
        // height: height - Utils.scale(176),
        maxHeight: Utils.scale(480),
        minHeight: Utils.scale(480),
        paddingBottom: Utils.scale(8)
        // flex: 1
    },
    detailView: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16)
    },
    detailImage: {
        width: Utils.scale(80),
        height: Utils.scale(80),
        borderRadius: Utils.scale(4)
    },
    detailTextView: {
        marginLeft: Utils.scale(16),
        justifyContent: "space-between",
        height: Utils.scale(80),
        paddingTop: 2,
        paddingBottom: 2
    },
    priceContainer: {
        flexDirection: "row"
    },
    detailText: {
        fontSize: Utils.scaleFontSizeFunc(13),
        color: Constant.grayText,
        width: width * 0.5
    },
    sellText: {
        fontSize: Utils.scaleFontSizeFunc(18),
        color: Constant.blackText,
        fontWeight: "bold",
    },
    marketText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: "#999999"
    },
    scrollStyle: {
        width: "100%",
        flex: 1,
        marginTop: 8
    },
    descTitle: {
        marginTop: Utils.scale(20),
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.lightText,
        width: "100%"
    },
    quantityTitle: {
        marginTop: Utils.scale(20),
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.lightText,
        width: "100%",
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16)
    },
    leftText: {
        //marginTop: Utils.scale(20),
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.themeText,
    },
    descView: {
        flexWrap: "wrap",
        flexDirection: "row",
        marginLeft: Utils.scale(3)
    },
    descTouch: {
        marginRight: Utils.scale(16),
        marginTop: Utils.scale(16),
        justifyContent: "center",
        alignItems: "center",
        minHeight: Utils.scale(30),
        backgroundColor: "#f2f2f2",
        borderRadius: Utils.scale(15),
        minWidth: Utils.scale(30),
        paddingLeft: Utils.scale(20),
        paddingRight: Utils.scale(20),
        paddingTop: Utils.scale(3),
        paddingBottom: Utils.scale(3),
        borderWidth: 1,
        borderColor: "#f2f2f2"
    },
    descTouchSel: {
        backgroundColor: "#fff2f5",
        borderWidth: 1,
        borderColor: Constant.themeText
    },
    descDisable: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: Constant.lightText,
        borderStyle: "dashed"
    },

    descText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: Constant.blackText
    },
    descSelText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: Constant.themeText
    },
    descDisText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: Constant.lightText
    },
    addBtn: {
        position: "absolute",
        bottom: Utils.scale(8),
        width: "100%",
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16)
    },
    addTextContainer: {
        flex: 1,
        height: Utils.scale(49),
        borderRadius: Utils.scale(25),
        backgroundColor: Constant.themeText,
        justifyContent: "center",
        alignItems: "center"
    },
    addText: {
        color: "white",
        fontSize: Utils.scaleFontSizeFunc(14)
    },
    cancelBtn: {
        width: Utils.scale(22),
        height: Utils.scale(22),
        justifyContent: "center",
        alignItems: "center",
        right: Utils.scale(16),
        top: Utils.scale(16),
        position: "absolute"
    },
    indicatorView: {
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    quantityView: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: Utils.scale(7)
    },
    quantityTextView: {
        width: Utils.scale(20),
        alignItems: "center",
        justifyContent: "center",
        height: Utils.scale(20)
    },
    quantityText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        fontWeight: "bold",
        color: Constant.blackText
    },
    addImage: {
        width: Utils.scale(22),
        height: Utils.scale(22),
        margin: Utils.scale(16)
    },
    addImage2: {
        width: Utils.scale(22),
        height: Utils.scale(22),
        margin: Utils.scale(16)
    },
    btnView: {
        // height: Utils.scale(73),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        marginBottom: Utils.scale(20)
    },

    touchStyle: {
        marginTop: Utils.scale(16),
        width: Utils.scale(38),
        height: Utils.scale(38),
        borderRadius: Utils.scale(6),
        marginRight: Utils.scale(12),
        alignItems: "center",
        justifyContent: "center"
    },
    imageStyle: {
        width: Utils.scale(36),
        height: Utils.scale(36),
        borderRadius: Utils.scale(6)
    }
});
