import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import OText from "../../component/OText/OText";

import Utils from "../../utils/Utils";
import * as Constant from "../../utils/Constant";

export default class DetailRefund extends Component {
    //构造函数
    constructor(props) {
        super(props);
    }

    //渲染
    render() {
        return (
            <View style={{ padding: 16 }}>
                <OText
                    text={"APP_DETAIL_QA.QA0"}
                    style={styles.returnTitle}
                />
                <OText
                    text={"APP_DETAIL_QA.QA1"}
                    style={styles.returnMid}
                />
                <OText
                    text={"APP_DETAIL_QA.QA11"}
                    style={styles.returnDetail}
                />
                <OText
                    text={"APP_DETAIL_QA.QA2"}
                    style={styles.returnMid}
                />
                <OText
                    text={"APP_DETAIL_QA.QA21"}
                    style={styles.returnDetail}
                />
                <OText
                    text={"APP_DETAIL_QA.QA3"}
                    style={styles.returnMid}
                />
                <OText
                    text={"APP_DETAIL_QA.QA31"}
                    style={styles.returnDetail}
                /><OText
                    text={"APP_DETAIL_QA.QA4"}
                    style={styles.returnTitle}
                />
                <OText
                    text={"APP_DETAIL_QA.QA41"}
                    style={styles.returnDetail}
                /><OText
                    text={"APP_DETAIL_QA.QA5"}
                    style={styles.returnMid}
                />
                <OText
                    text={"APP_DETAIL_QA.QA51"}
                    style={styles.returnDetail}
                /><OText
                    text={"APP_DETAIL_QA.QA6"}
                    style={styles.returnMid}
                />
                <OText
                    text={"APP_DETAIL_QA.QA61"}
                    style={styles.returnDetail}
                />
                <OText
                    text={"APP_DETAIL_QA.QA7"}
                    style={styles.returnMid}
                />
                <OText
                    text={"APP_DETAIL_QA.QA71"}
                    style={styles.returnDetail}
                />
                <OText
                    text={"APP_DETAIL_QA.QA7"}
                    style={styles.returnMid}
                />
                <OText
                    text={"APP_DETAIL_QA.QA71"}
                    style={styles.returnDetail}
                />
                <OText
                    text={"APP_DETAIL_QA.QA8"}
                    style={styles.returnMid}
                />
                <OText
                    text={"APP_DETAIL_QA.QA81"}
                    style={styles.returnDetail}
                />
                <OText
                    text={"APP_DETAIL_QA.QA9"}
                    style={styles.returnMid}
                />
                <OText
                    text={"APP_DETAIL_QA.QA91"}
                    style={styles.returnDetail}
                />
                <OText
                    text={"APP_DETAIL_QA.QA10"}
                    style={styles.returnMid}
                />
                <OText
                    text={"APP_DETAIL_QA.QA101"}
                    style={styles.returnDetail}
                />
                <OText
                    text={"APP_DETAIL_QA.QA1101"}
                    style={styles.returnTitle}
                />
                <OText
                    text={"APP_DETAIL_QA.QA1102"}
                    style={styles.returnDetail}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    returnTitle: {
        fontSize: Utils.scaleFontSizeFunc(20),
        color: Constant.blackText,
        marginTop: Utils.scale(20),
        fontWeight: "bold",
    },
    returnMid: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.blackText,
        marginTop: Utils.scale(20),
        marginBottom: Utils.scale(12),
        fontWeight: "bold",
    },
    returnDetail: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.grayText,
        marginTop: Utils.scale(10)
    }
});
