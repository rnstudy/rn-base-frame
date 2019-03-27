import React, { Component } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import OText from "../../component/OText/OText";

import Utils from "../../utils/Utils";
import * as Constant from "../../utils/Constant";
import TRUE_ICON from "../../res/img/detail_true.png";
import I18n from "../../config/i18n";
import { toJS } from "mobx";

export default class FreeView extends Component {
    //构造函数
    constructor(props) {
        super(props);
    }

    //渲染
    render() {
        const { postInfo, unit } = this.props;
        const freePrice = (postInfo && postInfo.freePrice) || "";
        return (
            <View style={styles.freeView}>

                {/* 正品 */}
                <View style={styles.freeItem}>
                    <Image style={styles.freeImage} source={TRUE_ICON} />
                    <OText
                        style={styles.freeText}
                        text={"COMMON.TEXT_GENUINE_GUARANTEE"}
                    />
                </View>

                {/* 包邮 */}
                <View style={styles.freeItem}>
                    <Image style={styles.freeImage} source={TRUE_ICON} />
                    <OText
                        style={styles.freeText}
                        text={"COMMON.TEXT_FREE_SHIPPING"}
                        option1={{ unit: unit || "$", value: freePrice }}
                    />
                </View>

                {/* 高返佣 */}
                <View style={styles.freeItem}>
                    <Image style={styles.freeImage} source={TRUE_ICON} />
                    <OText
                        style={styles.freeText}
                        text={"COMMON.TEXT_FREE_RETURN"}
                    />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    freeView: {
        backgroundColor: "#f8f8f8",
        width: "100%",
        minHeight: Utils.scale(38),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
        paddingTop: Utils.scale(8),
        paddingBottom: Utils.scale(8)
    },
    freeItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: Utils.scale(4),
        marginBottom: Utils.scale(4)
    },
    freeImage: {
        height: Utils.scale(14),
        width: Utils.scale(14),
    },
    freeText: {
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginLeft: Utils.scale(5),
        maxWidth: Utils.scale(330)
    }
});
