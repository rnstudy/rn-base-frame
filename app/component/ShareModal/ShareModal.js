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
    TouchableOpacity,
    Platform,
    StatusBar,
    Image,
    Clipboard,
    ScrollView
} from "react-native";

import OText from "../OText/OText";
import I18n, { priceTranslations } from "../../config/i18n";
import * as Constant from "../../utils/Constant";
import Utils from "../../utils/Utils";
const { width, height } = Dimensions.get("window");
import ShareIcon from "./ShareIcon";
import QRCode from 'react-native-qrcode-svg';

import AppSetting from "../../store/AppSetting";
import NativeShare from "../../utils/NativeShare";
import BackIcon from "../../res/img/navi_close.png";
import icon from "../../res/img/share_icon.png";
import iconDeer from "../../res/images/icon-deer.png";
import head from "../../res/images/default_head.png";
import iconSelectImg from "../../res/images/icon-select-orange.png";
import ViewShot from "../../component/ViewShot";
import NetUtils from "../../utils/NetUtils";
import * as Api from "../../utils/Api";
import Toast from "../GoodsDetailModal/Toast";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
export default class ShareModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showIndicator: false,
            goodsImgLoading: false,
            qrcodeImgLoading: false,
            modalVisible: false,
            qrCodeUrl: "",
            link: "https://www.baidu.com",
            sharePlatform: [
                {
                    text: "SHARE_MASK_WECHAT_FRIEND",
                    platform: "WEIXIN",
                    enable: false
                },
                {
                    text: "SHARE_MASK_WECHAT_COMMENTS",
                    platform: "WEIXIN_CIRCLE",
                    enable: false
                },
                {
                    text: "SHARE_MASK_DOWNLOAD",
                    platform: "SHARE_MASK_DOWNLOAD",
                    enable: true
                },
                {
                    text: "SHARE_MASK_COPY_LINK",
                    platform: "SHARE_MASK_COPY_LINK",
                    enable: true
                }
            ]
        };
    }

    componentWillMount() {
        NativeShare.asynSupportPlatform()
            .then(result => {
                const supWX = result.Support_WechatSession;
                let platform = JSON.parse(
                    JSON.stringify(this.state.sharePlatform)
                );
                platform[0].enable = supWX;
                platform[1].enable = supWX;
                this.setState({
                    sharePlatform: platform
                });
            })
            .catch(error => { });
    }

    openModal(shareData) {
        try {
            const { link } = shareData;
            const params = { originUrl: link };
            this.setState(
                {
                    showIndicator: true
                },
                () => {
                    NetUtils.post(Api.SHARE_SHORT_LINK, params)
                        .then(result => {
                            if (result && result.data && result.data.key) {
                                InteractionManager.runAfterInteractions(() => {
                                    this.setState({
                                        qrCodeUrl:
                                            AppSetting.BaseUrl +
                                            "/s/" +
                                            result.data.key,
                                        showIndicator: false
                                    });
                                });
                            }
                        })
                        .catch(e => {
                            this.setState({
                                showIndicator: false
                            });
                        });
                    InteractionManager.runAfterInteractions(() => {
                        try {
                            this.setState({
                                modalVisible: true,
                                shareData
                            });
                        } catch (error) {
                            console.log("====openModal===", error);
                        }
                    });
                }
            );
        } catch (error) {
            console.log("-----", error);
        }
    }

    closeModal() {
        try {
            this.setState({
                showIndicator: false,
                modalVisible: false,
                qrCodeUrl: ""
            });
        } catch (error) { }
    }

    pressIcon(data) {
        try {
            this.setState(
                {
                    showIndicator: true
                },
                () => {
                    InteractionManager.runAfterInteractions(() => {
                        try {
                            const { platform } = data;
                            const { shareData } = this.state;
                            const { title, desc, link, imageUrl } = shareData;
                            if (platform + "" === "SHARE_MASK_DOWNLOAD") {
                                this.refs.viewShot.capture().then(uri => {
                                    this.showToast(
                                        I18n("SHARE_MASK_COPY_IMAGE")
                                    );
                                    this.setState({
                                        showIndicator: false
                                    });
                                });
                                return;
                            } else if (
                                platform + "" ===
                                "SHARE_MASK_COPY_LINK"
                            ) {
                                Clipboard.setString(link);
                                this.showToast(I18n("SHARE_MASK_COPY_SUCCESS"));
                                this.setState({
                                    showIndicator: false
                                });
                                //this.closeModal();
                                return;
                            }
                            let imgUrl =
                                "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553693469657&di=5d954674694de5c2d8bbab181287f4f9&imgtype=0&src=http%3A%2F%2Fpic2.zhimg.com%2F50%2Fv2-b6a750f487ddbf996fc516f1e82445fb_b.jpg";
                            if (imageUrl && imageUrl + "" != "") {
                                imgUrl = imageUrl;
                            }
                            NativeShare.shareNoBoard(
                                title,
                                desc,
                                imgUrl,
                                link,
                                platform
                            ).then(msg => {
                                this.closeModal();
                            }).catch(msg2 => {
                                this.closeModal();
                            });
                            if (Platform.OS === "ios") {
                                this.closeModal();
                            }
                        } catch (error) {
                            this.closeModal();
                        }
                        setTimeout(() => {
                            try {
                                this.setState({
                                    showIndicator: false
                                });
                            } catch (error) { }
                        }, 5000);
                    });
                }
            );
        } catch (error) { }
    }

    renderIcon() {
        return (
            <View style={styles.iconViewContainer}>
                <ScrollView
                    style={styles.iconView}
                    horizontal="true"
                    showsHorizontalScrollIndicator={false}
                >
                    {this.state.sharePlatform.map((data, i) => {
                        return (
                            <ShareIcon
                                pressFun={() => this.pressIcon(data)}
                                key={i}
                                data={data}
                            />
                        );
                    })}
                </ScrollView>
            </View>
        );
    }

    renderIndicator() {
        if (
            this.state.showIndicator ||
            this.state.goodsImgLoading ||
            this.state.qrcodeImgLoading
        ) {
            return (
                <View style={styles.indicatorView}>
                    <ActivityIndicator color={Constant.themeText} />
                </View>
            );
        }
    }

    showToast(text) {
        this.refs.toast.show(text);
    }

    renderShotView() {
        const { shareData } = this.state;
        const {
            desc,
            shareName,
            imageUrl: photo,
            link,
            skuName,
            marketPrice,
            sellPrice,
            storeName,
            headImg,
            pilicy
        } = shareData;
        const headImageSource =
            headImg && headImg != "" ? { uri: headImg } : head;
        return (
            <View style={styles.viewStyle}>
                <View style={styles.shotView}>
                    <ViewShot ref="viewShot">
                        <View style={styles.shotView}>
                            <View style={styles.headImgContainer}>
                                <Image
                                    source={headImageSource}
                                    style={styles.storeHead}
                                />
                                <View style={styles.headRightContent}>
                                    <Text
                                        style={styles.storeName}
                                        numberOfLines={1}
                                    >
                                        {storeName}
                                    </Text>
                                    <Text
                                        style={styles.storeSub}
                                        numberOfLines={1}
                                    >
                                        {desc}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.recommangContainer}>
                                <Image
                                    source={icon}
                                    style={styles.recommangBg}
                                />
                                <View style={styles.recommandTextContainer}>
                                    <Text
                                        style={styles.recommandText}
                                        numberOfLines={2}
                                    >
                                        {shareName}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.goodsImageContainer}>
                                <Image
                                    source={{ uri: photo }}
                                    style={styles.goodsImage}
                                    resizeMethod={"scale"}
                                    onLoadStart={() => {
                                        this.showLoading("goodsImgLoading");
                                    }}
                                    onLoadEnd={() => {
                                        this.hideLoading("goodsImgLoading");
                                    }}
                                />
                            </View>
                            <View style={styles.goodsDetail}>
                                <View style={styles.goodsDetailLeftContainer}>
                                    <Text
                                        style={styles.goodsText}
                                        numberOfLines={2}
                                    >
                                        {skuName}
                                    </Text>
                                    {marketPrice != null && (
                                        <Text style={styles.sellPriceText}>
                                            {marketPrice}
                                        </Text>
                                    )}
                                    <Text style={styles.goodsPriceText}>
                                        {sellPrice}
                                    </Text>
                                </View>
                                {this.renderQrImage()}
                            </View>
                            {this.renderPolicy(pilicy)}
                        </View>
                    </ViewShot>
                </View>
            </View>
        );
    }

    renderQrImage() {
        const { qrCodeUrl } = this.state;
        if (qrCodeUrl && qrCodeUrl + "" !== "") {
            return (
                <View style={styles.qrCodeContainer}>
                    <Image source={iconDeer} style={styles.iconDeer} />
                    {Constant.isIOS ? null : <QRCode
                        value={qrCodeUrl}
                        size={66}
                    />}
                </View>
            );
        }
        return (
            <View
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
            />
        );
    }
    renderPolicy(pilicy) {
        if (pilicy && pilicy.length > 0) {
            return (
                <View style={styles.policyContainer}>
                    {pilicy.map((el, index) => {
                        return (
                            <View
                                style={styles.policyItem}
                                key={"pilicy" + index}
                            >
                                <Image
                                    source={iconSelectImg}
                                    style={styles.iconSelect}
                                />
                                <Text style={styles.policyText}>{el}</Text>
                            </View>
                        );
                    })}
                </View>
            );
        }
    }
    renderStatBar() {
        if (Platform.OS === "ios") {
            return <StatusBar barStyle={"default"} />;
        }
        return null;
    }

    renderHead() {
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => this.closeModal()}>
                    <View style={styles.backView}>
                        <Image
                            resizeMode={"contain"}
                            style={{
                                width: Utils.scale(22),
                                height: Utils.scale(22)
                            }}
                            source={BackIcon}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    renderShareTip() {
        return (
            <View style={styles.shareTipContainer}>
                <OText
                    style={styles.shareTip}
                    text={"COLLECTION_LIST_PAGE.TEXT_SHARE_TIP"}
                    numberOfLines={2}
                />
            </View>
        );
    }
    render() {
        try {
            return (
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.closeModal();
                    }}
                    style={{ zIndex: 10000 }}
                >
                    <View style={styles.container}>
                        <View style={styles.headerView}>
                            {this.renderStatBar()}
                            {this.renderHead()}
                        </View>
                        {this.state.shareData && this.renderShotView()}
                        {this.renderShareTip()}
                        {this.renderIcon()}
                        {this.renderIndicator()}
                    </View>
                    <Toast ref="toast" />
                </Modal>
            );
        } catch (error) {
            return <View />;
        }
    }
    showLoading(type) {
        let obj = {};
        obj[type] = true;
        this.setState(obj);
    }
    hideLoading(type) {
        let obj = {};
        obj[type] = false;
        this.setState(obj);
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0)"
    },
    container: {
        flex: 1,
        backgroundColor: Constant.mainBackgroundColor,
        width: width,
        height: height,
        paddingBottom: Constant.paddingIPXBottom
    },
    viewStyle: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#f2f2f2",
        paddingTop: Utils.scale(13),
        paddingBottom: Utils.scale(13),
        flex: 1
    },
    shotView: {
        width: Utils.scale(244),
        height: Utils.scale(434),
        backgroundColor: "white",
        alignItems: "center"
    },
    headImgContainer: {
        flexDirection: "row",
        marginLeft: Utils.scale(13),
        marginBottom: Utils.scale(11),
        marginTop: Utils.scale(19),
        marginRight: Utils.scale(13)
    },
    storeHead: {
        width: Utils.scale(40),
        height: Utils.scale(40),
        borderRadius: Utils.scale(20)
    },
    headRightContent: {
        flex: 1,
        marginLeft: Utils.scale(8),
        justifyContent: "center",
        textAlign: "left"
    },
    storeName: {
        fontSize: Utils.scaleFontSizeFunc(13),
        color: "#333333"
    },
    storeSub: {
        fontSize: Utils.scaleFontSizeFunc(10),
        marginTop: Utils.scale(5),
        color: "#333333"
    },
    recommangContainer: {
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        height: Utils.scale(60),
        width: "100%",
        flexDirection: "row"
    },
    recommangBg: {
        width: Utils.scale(18),
        height: Utils.scale(15)
    },
    recommandTextContainer: {
        height: "100%",
        paddingLeft: Utils.scale(20),
        paddingRight: Utils.scale(20)
    },
    recommandText: {
        textAlign: "left",
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(18),
        fontWeight: "bold"
    },
    earnView: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: Utils.scale(12),
        justifyContent: "center"
    },
    earnText: {
        color: Constant.themeText,
        fontSize: Constant.largeSize
    },
    detailText: {
        fontSize: Constant.smallSize,
        marginLeft: Utils.scale(38),
        marginRight: Utils.scale(38),
        textAlign: "center"
    },
    iconViewContainer: {
        height: Utils.scale(99)
    },
    iconView: {
        flexDirection: "row",
        marginLeft: Utils.scale(17),
        marginRight: Utils.scale(17)
    },
    skip: {
        backgroundColor: "#f2f2f2",
        width: "100%",
        height: Utils.scale(10)
    },
    cancelBtn: {
        width: "100%",
        height: Utils.scale(53),
        justifyContent: "center",
        alignItems: "center"
    },
    shareTipContainer: {
        backgroundColor: "#F2F2F2"
    },
    shareTip: {
        marginLeft: Utils.scale(16),
        marginBottom: Utils.scale(20),
        marginTop: Utils.scale(20),
        marginRight: Utils.scale(16),
        fontSize: Utils.scaleFontSizeFunc(12),
        lineHeight: Utils.scale(16),
        color: "#333333",
        textAlign: "center"
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

    headerView: {
        backgroundColor: "#F2F2F2",
        height: Constant.sizeHeader
    },
    header: {
        justifyContent: "space-between",
        width: width,
        marginTop: Constant.sizeHeaderMarginTop,
        flexDirection: "row",
        height: Constant.sizeHeaderContent,
        alignItems: "center"
    },
    titleView: {
        left: 0,
        top: 0,
        height: Constant.sizeHeaderContent,
        position: "absolute",
        width: width,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: Utils.scale(17),
        width: "65%",
        textAlign: "center"
    },
    backView: {
        justifyContent: "center",
        paddingLeft: Utils.scale(10),
        width: Utils.scale(50)
    },
    rightView: {
        flex: 1,
        justifyContent: "center",
        paddingRight: Utils.scale(15),
        alignItems: "flex-end",
        minWidth: Utils.scale(50)
    },
    backTouch: {
        left: Utils.scale(11),
        top: Utils.scale(46),
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: Utils.scale(32),
        height: Utils.scale(32),
        borderRadius: Utils.scale(16),
        backgroundColor: "#ffffff",
        opacity: 0.8
    },
    backImage: {
        width: Utils.scale(22),
        height: Utils.scale(22)
    },
    shareTitle: {
        width: "100%",
        height: Utils.scale(64),
        resizeMode: ImageResizeMode.contain
    },
    goodsImageContainer: {
        width: Utils.scale(244),
        height: Utils.scale(182),
        alignItems: "center",
        justifyContent: "center",
        marginTop: Utils.scale(12),
        marginBottom: Utils.scale(15)
    },
    goodsImage: {
        width: Utils.scale(182),
        height: Utils.scale(182),
        resizeMode: "contain"
    },
    goodsDetail: {
        flexDirection: "row",
        paddingLeft: Utils.scale(20),
        paddingRight: Utils.scale(25),
        paddingBottom: Utils.scale(10)
    },
    goodsDetailLeftContainer: {
        flex: 1,
        marginRight: Utils.scale(26)
    },
    goodsText: {
        fontSize: Utils.scaleFontSizeFunc(10),
        color: Constant.blackText
    },
    sellPriceText: {
        fontSize: Utils.scaleFontSizeFunc(10),
        color: Constant.lightText,
        marginTop: Utils.scale(8),
        textDecorationLine: "line-through"
    },
    goodsPriceText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.blackText,
        marginTop: Utils.scale(6),
        fontWeight: "bold"
    },
    qrCodeContainer: {
        width: Utils.scale(40),
        height: Utils.scale(66),
        justifyContent: "center",
        alignItems: "center",
    },
    qrImg: {
        width: Utils.scale(45),
        height: Utils.scale(45)
    },
    iconDeer: {
        width: Utils.scale(42),
        height: Utils.scale(16)
    },
    policyContainer: {
        flexDirection: "row",
        width: Utils.scale(244),
        height: Utils.scale(10),
        justifyContent: "space-between",
        paddingLeft: Utils.scale(12),
        paddingRight: Utils.scale(12)
    },
    policyItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    iconSelect: {
        width: Utils.scale(10),
        height: Utils.scale(10),
        marginRight: Utils.scale(4)
    },
    policyText: {
        fontSize: Utils.scaleFontSizeFunc(8),
        color: "#333"
    }
});
