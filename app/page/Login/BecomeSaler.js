import React, { Component } from "react";
import I18n from "../../config/i18n";
import NetUtils from "../../utils/NetUtils";
import * as Constant from "../../utils/Constant";
import { SIGNIN, SIGNUP, VERIFICATION_CODE } from "../../utils/Api";
import OText from "../../component/OText/OText";
import ListFoot from "../../component/ListFoot/ListFoot";

import {
    Dimensions,
    InteractionManager,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ImageBackground,
    Image
} from "react-native";
import { Actions } from "react-native-router-flux";
import Utils from "../../utils/Utils";
import { inject, observer } from "mobx-react/native";
import BG from "../../res/images/gift_bg.png";
import CommonHeader from "../../component/Header/CommonHeader";
import { toJS } from "mobx";
const { width, height } = Dimensions.get("window");

@inject(stores => ({
    homeStore: stores.homeStore
}))
@observer
export default class BecomeSaler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            giftId: null
        };
    }

    componentWillMount() {
        this.props.homeStore.getGiftId(giftId => {
            this.setState({ giftId });
        });
    }

    componentDidMount() {}

    componentWillUnmount() {}

    renderGoods() {
        try {
            const { specialList } = this.props.homeStore;
            const { giftId } = this.state;
            const unit = "$";
            if (
                specialList[giftId] &&
                specialList[giftId].items &&
                specialList[giftId].items.length > 0
            ) {
                const { items } = specialList[giftId];
                return (
                    <View style={{ marginTop: Utils.scale(280), zIndex: 999 }}>
                        {items.map((obj, i) => {
                            const {
                                skuName,
                                photo,
                                recommend,
                                sellPrice,
                                marketPrice,
                                sku
                            } = obj;
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.itemView}
                                    onPress={() => {
                                        Actions.push("GoodsDetail", {
                                            productId: sku,
                                            gift: true
                                        });
                                    }}
                                >
                                    <Image
                                        style={styles.itemImage}
                                        source={{ uri: photo }}
                                    />
                                    <View
                                        style={{ marginLeft: Utils.scale(16) }}
                                    >
                                        <Text
                                            numberOfLines={2}
                                            style={styles.recText}
                                        >
                                            {recommend}
                                        </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={styles.nameText}
                                        >
                                            {skuName}
                                        </Text>
                                        <Text style={styles.priceText}>
                                            {unit}
                                            {sellPrice}
                                        </Text>
                                        <Text style={styles.markerText}>
                                            {unit}
                                            {marketPrice}
                                        </Text>
                                    </View>
                                    <View style={styles.btnStyle}>
                                        <OText
                                            style={styles.btnText}
                                            text={"GIFTPAGE.TEXT_BUY"}
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                        <OText
                            style={styles.limitTip}
                            text={"GIFTPAGE.TEXT_GIFT_TIP5"}
                        />
                        <ListFoot />
                    </View>
                );
            }
        } catch (error) {
            return (
                <View>
                    <ListFoot />
                </View>
            );
        }
    }

    renderFoot() {}

    render() {
        return (
            <CommonHeader title={I18n("GIFTPAGE.TEXT_TITLE_JOIN_US")}>
                <ScrollView
                    style={{
                        width: width,
                        height: height,
                        backgroundColor: "#EAB71C"
                    }}
                >
                    <ImageBackground
                        source={BG}
                        style={{
                            width: Utils.scale(375),
                            height: Utils.scale(667),
                            alignItems: "center",
                            position: "absolute",
                            top: 0,
                            left: 0
                        }}
                    >
                        <OText
                            text={"GIFTPAGE.TEXT_GIFT_SECTION"}
                            style={styles.titleText}
                        />
                        <OText
                            text={"GIFTPAGE.TEXT_GIFT_TIP"}
                            style={[
                                styles.titleText,
                                {
                                    fontSize: Utils.scaleFontSizeFunc(14),
                                    marginTop: Utils.scale(12),
                                    marginBottom: Utils.scale(5)
                                }
                            ]}
                        />
                        <OText
                            text={"GIFTPAGE.TEXT_GIFT_TIP1"}
                            style={styles.detailText}
                        />
                        <OText
                            text={"GIFTPAGE.TEXT_GIFT_TIP2"}
                            style={styles.detailText}
                        />
                        <OText
                            text={"GIFTPAGE.TEXT_GIFT_TIP3"}
                            style={styles.detailText}
                        />
                        <OText
                            text={"GIFTPAGE.TEXT_GIFT_TIP4"}
                            style={styles.detailText}
                        />
                    </ImageBackground>
                    {this.renderGoods()}
                </ScrollView>
            </CommonHeader>
        );
    }
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: Utils.scaleFontSizeFunc(34),
        color: "#ffeacf",
        fontWeight: "bold",
        marginTop: Utils.scale(85)
    },
    detailText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: "#ffeacf",
        marginTop: Utils.scale(5)
    },

    itemView: {
        marginLeft: Utils.scale(16),
        marginRight: Utils.scale(16),
        marginBottom: Utils.scale(10),
        borderRadius: Utils.scale(8),
        backgroundColor: "white",
        padding: Utils.scale(16),
        flexDirection: "row",
        height: Utils.scale(172),
        flex: 1,
        width: Utils.scale(343)
    },
    itemImage: {
        width: Utils.scale(140),
        height: Utils.scale(140)
    },
    recText: {
        fontSize: Utils.scaleFontSizeFunc(13),
        color: Constant.blackText,
        width: Utils.scale(155)
    },
    nameText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.lightText,
        marginTop: Utils.scale(6),
        width: Utils.scale(155)
    },
    priceText: {
        fontSize: Utils.scaleFontSizeFunc(20),
        color: Constant.blackText,
        fontWeight: "bold",
        marginTop: Utils.scale(12)
    },
    markerText: {
        textDecorationLine: "line-through",
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.lightText
    },
    btnStyle: {
        backgroundColor: Constant.themeText,
        width: Utils.scale(73),
        height: Utils.scale(30),
        borderRadius: Utils.scale(15),
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: Utils.scale(12),
        right: Utils.scale(12)
    },
    btnText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: "white"
    },
    limitTip: {
        fontSize: Utils.scaleFontSizeFunc(14),
        marginTop: Utils.scale(16),
        marginLeft: Utils.scale(16),
        marginRight: Utils.scale(16),
        marginBottom: Utils.scale(26),
        textAlign: "center",
        color: "white"
    }
});
