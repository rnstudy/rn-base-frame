import React, { Component } from "react";
import {
    ActivityIndicator,
    Clipboard,
    Dimensions,
    Image,
    InteractionManager,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView
} from "react-native";

import OText from "../OText/OText";
import I18n from "../../config/i18n";
import * as Constant from "../../utils/Constant";
import Utils from "../../utils/Utils";
import ShareIcon from "./ShareIcon";
import QRCode from 'react-native-qrcode-svg';

import AppSetting from "../../store/AppSetting";
import NativeShare from "../../utils/NativeShare";
import BackIcon from "../../res/img/navi_close.png";
import ViewShot from "../../component/ViewShot";
import NetUtils from "../../utils/NetUtils";
import * as Api from "../../utils/Api";
import Toast from "../GoodsDetailModal/Toast";
import ShopStore from "../../store/ShopStore";
import head from "../../res/images/default_head.png";
import ImageResizeMode from "react-native/Libraries/Image/ImageResizeMode";
import iconSelectImg from "../../res/images/icon-select-orange.png";
import iconFingerImg from "../../res/images/icon-fingerprint.png";

const { width, height } = Dimensions.get("window");

export default class ShareCollectionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showIndicator: false,
            imgLoading1: false,
            imgLoading2: false,
            imgLoading3: false,
            imgLoading4: false,
            modalVisible: false,
            qrCodeUrl: "",
            collectionDetail: null,
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
                const supFB = result.Support_Facebook;
                const supMS = result.Support_FaceBookMessenger;
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
        const { link } = shareData;
        const params = { originUrl: link };
        const {
            defaultTip,
            imageUrlList,
            storeName,
            headImg,
            collectionName,
            collectionId,
            pilicy
        } = shareData;
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
                            )
                                .then(msg => {
                                    this.closeModal();
                                })
                                .catch(msg2 => {
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
            this.state.imgLoading1 ||
            this.state.imgLoading2 ||
            this.state.imgLoading4 ||
            this.state.imgLoading4
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
            defaultTip,
            imageUrlList,
            link,
            storeName,
            headImg,
            collectionName,
            collectionId,
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
                                        {defaultTip}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.collectionNameContainer}>
                                <Text
                                    style={styles.collectionNameIcon}
                                    numberOfLines={1}
                                >
                                    #
                                </Text>
                                <Text
                                    style={styles.collectionName}
                                    numberOfLines={2}
                                >
                                    {collectionName}
                                </Text>
                                <Text
                                    style={styles.collectionNameIcon}
                                    numberOfLines={1}
                                >
                                    #
                                </Text>
                            </View>
                            {this.renderGoodsImage(imageUrlList)}
                            <View style={styles.bottomContainer}>
                                {this.renderPolicy(pilicy)}
                                {this.renderQrImage()}
                            </View>
                        </View>
                    </ViewShot>
                </View>
            </View>
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
    renderGoodsImage(imageUrlList) {
        return (
            <View>
                <View style={styles.goodsImageContainer}>
                    <Image
                        source={{ uri: imageUrlList[0] }}
                        style={styles.goodsImageSmall}
                        resizeMethod={"scale"}
                        onLoadStart={() => {
                            this.showLoading("imgLoading1");
                        }}
                        onLoadEnd={() => {
                            this.hideLoading("imgLoading1");
                        }}
                    />
                    <Image
                        source={{ uri: imageUrlList[1] }}
                        style={[
                            styles.goodsImageSmall,
                            styles.goodsImageSmallEven
                        ]}
                        resizeMethod={"scale"}
                        onLoadStart={() => {
                            this.showLoading("imgLoading2");
                        }}
                        onLoadEnd={() => {
                            this.hideLoading("imgLoading2");
                        }}
                    />
                </View>
                <View style={styles.goodsImageContainer}>
                    <Image
                        source={{ uri: imageUrlList[2] }}
                        style={styles.goodsImageSmall}
                        resizeMethod={"scale"}
                        onLoadStart={() => {
                            this.showLoading("imgLoading3");
                        }}
                        onLoadEnd={() => {
                            this.hideLoading("imgLoading3");
                        }}
                    />
                    <Image
                        source={{ uri: imageUrlList[3] }}
                        style={[
                            styles.goodsImageSmall,
                            styles.goodsImageSmallEven
                        ]}
                        resizeMethod={"scale"}
                        onLoadStart={() => {
                            this.showLoading("imgLoading4");
                        }}
                        onLoadEnd={() => {
                            this.hideLoading("imgLoading4");
                        }}
                    />
                </View>
            </View>
        );
    }

    renderQrImage() {
        const { qrCodeUrl } = this.state;
        if (qrCodeUrl && qrCodeUrl + "" !== "") {
            return (
                <View style={styles.qrImgWrap}>
                    {Constant.isIOS ? null : <QRCode
                        value={qrCodeUrl}
                        size={48}
                    />}
                    <View style={styles.fingerWrap}>
                        <Image
                            source={iconFingerImg}
                            style={styles.iconFinger}
                        />
                        <Text style={styles.fingerText}>
                            {I18n("COMMON.TEXT_LONG_TAP")}
                        </Text>
                    </View>
                </View>
            );
        }
        return (
            <View
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
            />
        );
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
                <View style={styles.titleView}>
                    <OText
                        numberOfLines={1}
                        style={styles.title}
                        text={"SHARE_MASK_SHARE"}
                    />
                </View>
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

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.closeModal();
                }}
            >
                <View style={styles.container}>
                    <View style={styles.headerView}>
                        {this.renderStatBar()}
                        {this.renderHead()}
                    </View>
                    {this.state.shareData && this.renderShotView()}
                    {this.renderIcon()}
                    {this.renderIndicator()}
                </View>
                <Toast ref="toast" />
            </Modal>
        );
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
        width: Utils.scale(225),
        height: Utils.scale(400),
        alignItems: "center",
        backgroundColor: "#FFF"
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
    collectionNameContainer: {
        marginTop: Utils.scale(5),
        marginLeft: Utils.scale(26),
        marginRight: Utils.scale(26),
        fontSize: Utils.scale(26),
        lineHeight: Utils.scale(37),
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    collectionNameIcon: {
        color: Constant.themeText
    },
    collectionName: {
        color: "#333333"
    },
    iconView: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingLeft: Utils.scale(17),
        paddingRight: Utils.scale(17),
        height: Utils.scale(178)
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
    container: {
        flex: 1,
        backgroundColor: Constant.mainBackgroundColor,
        width: width,
        height: height,
        paddingBottom: Constant.paddingIPXBottom
    },
    headerView: {
        backgroundColor: "#FFFFFF",
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
        width: Utils.scale(50),
        flex: 1
    },
    storeHead: {
        width: Utils.scale(20),
        height: Utils.scale(20),
        borderRadius: Utils.scale(10)
    },
    goodsImage: {
        width: Utils.scale(205),
        height: Utils.scale(205),
        marginTop: Utils.scale(4),
        resizeMode: "contain"
    },
    goodsImageSmall: {
        width: Utils.scale(100),
        height: Utils.scale(100),
        marginTop: Utils.scale(4),
        resizeMode: "contain"
    },

    goodsImageContainer: {
        marginTop: Utils.scale(12),
        marginLeft: Utils.scale(12),
        marginRight: Utils.scale(12),
        marginBottom: Utils.scale(18),
        flexDirection: "row"
    },
    goodsImageSmall: {
        width: Utils.scale(99),
        height: Utils.scale(99)
    },
    goodsImageSmallEven: {
        marginLeft: Utils.scale(5)
    },
    qrImg: {
        width: Utils.scale(48),
        height: Utils.scale(48)
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingLeft: Utils.scale(9),
        paddingRight: Utils.scale(9),
        paddingBottom: Utils.scale(9)
    },
    policyContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        width: Utils.scale(71)
    },
    policyItem: {
        flex: 1,
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
    },
    qrImgWrap: {
        width: Utils.scale(120),
        height: Utils.scale(54),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: Utils.scale(1),
        borderColor: "#E5E5E5",
        marginLeft: Utils.scale(20)
    },
    fingerWrap: {
        marginLeft: Utils.scale(6),
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    iconFinger: {
        width: Utils.scale(22.8),
        height: Utils.scale(24)
    },
    fingerText: {
        fontSize: Utils.scaleFontSizeFunc(8),
        color: "#999"
    },
    iconViewContainer: {
        height: Utils.scale(99)
    },
    iconView: {
        flexDirection: "row",
        marginLeft: Utils.scale(17),
        marginRight: Utils.scale(17)
    }
});
