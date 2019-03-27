import React, { Component } from "react";
import {
    View,
    StyleSheet,
    NativeModules,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    WebView,
    TouchableWithoutFeedback,
    InteractionManager
} from "react-native";
import I18n from "../../config/i18n";
import { Actions } from "react-native-router-flux";
import * as Constant from "../../utils/Constant";
import CommonHeader from "../../component/Header/CommonHeader";
import ShareModal from "../../component/ShareModal/ShareModal";
import GoodsDetailModal from "../../component/GoodsDetailModal/GoodsDetailModal";
import Utils from "../../utils/Utils";
import { inject, observer } from "mobx-react/native";

const { width, height } = Dimensions.get("window");
import Carousel from "../../component/Carousel/Carousel";
import FitImage from "react-native-fit-image";

import OText from "../../component/OText/OText";
import DEFAULT_IMAGE from "../../res/images/loading3.gif";
import ImageViewer from "react-native-image-zoom-viewer";

import DetailRefund from "../../component/GoodsDetailComponent/DetailRefund";
import ShopCartIcon from '../../component/ShopCartIcon/ShopCartIcon';
import FreeView from "../../component/GoodsDetailComponent/FreeView";
import CustomToast from "../../component/GoodsDetailModal/Toast";

import { toJS } from "mobx";

@inject(stores => ({
    shopStore: stores.shopStore,
    detailStore: stores.goodsDetailStore,
    appSetting: stores.appSetting,
    shopCartStore: stores.shopCartStore
}))
@observer
export default class GoodsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productId: props.productId,
            quantity: 1,
            skuArray: null,
            skuLength: 0,
            openImageModal: false,
            sellPrice: null,
            commission: null,
            limitQuantityMin: 1,
            limitQuantityMax: 20,
            limitSellMax: 20,
            detailState: true,//展示详情图 || 退货政策
        };
    }

    componentWillMount() {
        this.getGoodsData(this.state.productId, () => {
            this.setMainSku();
        });
    }

    setMainSku() {
        InteractionManager.runAfterInteractions(() => {
            const { data } = this.props.detailStore.goodsDetail[this.state.productId]
            const { propertyList, productInfo } = data;
            const { limitQuantityMin, limitQuantityMax, propertyMainValue, limitSellMax } = productInfo
            if (this.state.skuArray == null) {
                let skuArray = new Array(Object.getOwnPropertyNames(propertyList).length);
                skuArray[0] = propertyMainValue;
                this.setState({
                    skuArray,
                    limitQuantityMin,
                    limitQuantityMax,
                    limitSellMax
                })
            } else {
                this.setState({
                    limitQuantityMin,
                    limitQuantityMax,
                    limitSellMax
                })
            }

        })
    }

    componentDidMount() { }

    componentWillUnmount() {
        try {
            this.refs.ShareModal.closeModal();
        } catch (error) { }
        try {
            this.refs.GoodsDetailModal.closeModal();
        } catch (error) { }
    }

    getGoodsData(productId, callBack) {
        this.props.detailStore.getGoodsDetail(productId, () => {
            try {
                InteractionManager.runAfterInteractions(() => {
                    const { data } = this.props.detailStore.goodsDetail[this.state.productId]
                    const { propertyList } = data;
                    this.setState({
                        skuLength: Object.getOwnPropertyNames(propertyList).length
                    })
                })
            } catch (error) {
            }
            callBack && callBack();
        });
    }

    renderImage() {
        try {
            const productData = this.props.detailStore.goodsDetail[
                this.state.productId
            ].data;
            const { banners, productInfo } = productData;
            const { limitSellMax, limitQuantityMin, status } = productInfo;

            const soldOut =
                limitSellMax + "" === "0" ||
                limitSellMax < limitQuantityMin || status + '' === '1';
            let isLeft = false;

            if (
                productInfo &&
                limitSellMax &&
                limitSellMax < 6 &&
                limitSellMax > 0 &&
                !soldOut
            ) {
                isLeft = true;
            }
            if (banners && banners.length > 0) {
                return (
                    <Carousel
                        delay={2000}
                        style={styles.detailImgView}
                        pageInfo={false}
                        bullets={banners.length > 1}
                        isLooped={false}
                        chosenBulletStyle={styles.chosenBullet}
                        bulletsContainerStyle={styles.bulletsContainerStyle}
                        autoplay={false}
                        bulletStyle={styles.bullet}
                    >
                        {banners.map((url, index) => {
                            return (
                                <TouchableWithoutFeedback
                                    key={url + index}
                                    onPress={() =>
                                        this.setState({ openImageModal: true })
                                    }
                                >
                                    <View
                                        style={[
                                            styles.detailImgView,
                                            {
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }
                                        ]}
                                    >
                                        <Image
                                            resizeMode={"contain"}
                                            source={{ uri: url }}
                                            style={styles.detailImg}
                                            defaultSource={DEFAULT_IMAGE}
                                        />
                                        {soldOut && (
                                            <View
                                                style={styles.soldOutViewStyle}
                                            >
                                                <View style={styles.soldOutBg}>
                                                    <OText
                                                        text={
                                                            "COMMON.STORE_FLASHSALE_SOLDOUT"
                                                        }
                                                        style={
                                                            styles.soldOutText
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {isLeft && (
                                            <View
                                                style={
                                                    styles.leftCountContainer
                                                }
                                            >
                                                <OText
                                                    text={"CART.CART_LEFT"}
                                                    option1={{ num: limitSellMax }}
                                                    style={styles.soldOutText}
                                                />
                                            </View>
                                        )}
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    </Carousel>
                );
            }
            return <View />;
        } catch (error) {
            console.log("=====renderImageerror===", error);
        }
    }

    limitView() {
        try {
            const { productInfo } = this.props.detailStore.goodsDetail[
                this.state.productId
            ].data;
            const { limitQuantityMin, limitQuantityMax } = productInfo;
            let limitMin = null;
            let limitMax = null;
            if (limitQuantityMin && limitQuantityMin > 1) {
                limitMin = (
                    <View style={styles.limTextWrap}>
                        <OText
                            style={styles.limText}
                            text={"DETAIL.PIECES_FOR_SALE"}
                            option1={{ number: limitQuantityMin }}
                        />
                    </View>
                );
            }
            if (limitQuantityMax && limitQuantityMax <= 20) {
                limitMax = (
                    <View style={styles.limTextWrap}>
                        <OText
                            style={styles.limText}
                            text={"DETAIL.PURCHASE_FOR_SALE"}
                            option1={{ number: limitQuantityMax }}
                        />
                    </View>
                );
            }
            if (limitMin || limitMax) {
                return (
                    <View style={styles.limTextContainer}>
                        {limitMin}
                        {limitMax}
                    </View>
                );
            }
        } catch (error) { }
        return <View />;
    }

    renderDetail() {
        try {
            const { productInfo, unit } = this.props.detailStore.goodsDetail[
                this.state.productId
            ].data;
            const {
                sellPrice,
                marketPrice,
                commission,
                recommend,
                skuName,
                limitQuantityList
            } = productInfo;
            let commissionView =
                commission > 0 ? (
                    <OText
                        text={"EARN"}
                        option1={{ unit, commission }}
                        style={styles.bonusText}
                    />
                ) : null;
            showRecommend = recommend ? true : false;
            showSkuName = skuName ? true : false;
            showMarketPrice = sellPrice < marketPrice ? true : false;
            return (
                <View style={styles.detailView}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-end",
                            fontWeight: "bold"
                        }}
                    >
                        <Text style={styles.sellText}>
                            {unit}
                            {sellPrice}
                        </Text>
                        {commissionView}
                    </View>
                    {showRecommend && (
                        <Text style={styles.recommendText}>{recommend}</Text>
                    )}
                    {showSkuName && (
                        <Text style={styles.skuNameText}>{skuName}</Text>
                    )}
                </View>
            );
        } catch (error) {
            console.log("=====renderDetailerror===", error);
        }
    }

    renderDetailImage() {
        try {
            const { data } = this.props.detailStore.goodsDetail[this.state.productId];
            const { detailState } = this.state;
            let view = detailState ? data.detailImages.map((obj, index) => {
                return (
                    <FitImage
                        source={{ uri: obj }}
                        key={obj + index + "spu"}
                    />
                );
            }) : <DetailRefund />
            return (
                <View >
                    <View style={{ width: '100%', flexDirection: 'row', height: Utils.scale(54) }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ detailState: !this.state.detailState })
                            }}
                            style={[styles.detailTabView, !detailState ? { backgroundColor: '#f8f8f8' } : null]}>
                            <OText
                                text={'DETAIL.STORE_DETAIL_DESCRIPTION'}
                                style={[styles.detailTabText, detailState ? { fontWeight: "bold", } : null]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ detailState: !this.state.detailState })
                            }}
                            style={[styles.detailTabView, detailState ? { backgroundColor: '#f8f8f8' } : null]}>
                            <OText
                                text={'DETAIL.STORE_DETAIL_SHIPPING_RETURNS'}
                                style={[styles.detailTabText, !detailState ? { fontWeight: "bold", } : null]}
                            />
                        </TouchableOpacity>
                    </View>
                    {view}
                </View>
            );
        } catch (error) {

            return <View />
        }
    }

    openBuyModal() {
        if (this.props.gift) {
            this.addCartFun()
            return;
        }
        this.refs.GoodsDetailModal.openModal();
    }

    openShare() {
        try {
            const {
                productInfo,
                postInfo,
                unit
            } = this.props.detailStore.goodsDetail[this.state.productId].data;
            const itemData = productInfo;
            const shareData = Utils.setShareData(
                this.props.shopStore.storeInfo,
                itemData,
                this.props.appSetting.BaseUrl,
                this.props.appSetting.getCurrentLanguage.code,
                unit
            );
            this.refs.ShareModal.openModal(shareData);
        } catch (error) {
            console.log("=========openShare=error===", error);
        }
    }

    addCartFun() {
        if (this.props.gift) {
            let params = {
                quantity: 1,
                sku: this.props.productId,
                type: 1
            }
            this.props.detailStore.addToCart(
                params,
                () => Actions.push('CheckOut', { gift: true })
            );
            return;
        }
        try {
            let flashSaleComming = true;
            let soldOut = true;
            try {
                const {
                    productInfo,
                    flashSale
                } = this.props.detailStore.goodsDetail[this.state.productId].data;
                const { limitSellMax, limitQuantityMin } = productInfo;
                soldOut = limitSellMax + "" === "0" || limitSellMax < limitQuantityMin;
                const intStart = parseInt(flashSale.spStartTime || 0) * 1000
                const intCurrent = parseInt(flashSale.spCurrentTime || 0) * 1000
                flashSaleComming = intStart < intCurrent ? false : true;
            } catch (error) {
            }
            if (soldOut) {
                this.refs.GoodsDetailModal.showToast('商品已抢光')
                return
            } else if (flashSaleComming) {
                this.refs.GoodsDetailModal.showToast('即将开抢')
            }

            const { skuArray, quantity } = this.state;
            let flag = true;
            const { data } = this.props.detailStore.goodsDetail[this.state.productId];
            const { flashSale, productInfo } = data;
            const { spu } = productInfo;
            const { spId } = flashSale;
            let lastSku = spu;
            for (const iterator of skuArray) {
                if (iterator === undefined) {
                    flag = false;
                } else {
                    lastSku += iterator
                }
            }
            if (flag) {
                let params = {
                    quantity,
                    sku: lastSku,
                    spId
                }
                this.props.detailStore.addToCart(
                    params,
                    () => this.addCartSuccess(),
                    data => {
                        data.msg && this.refs.GoodsDetailModal.showToast(data.msg);
                    }
                );
            } else {
                this.refs.GoodsDetailModal.showToast('请选择商品属性')
            }
        } catch (error) {
        }
    }

    addCartSuccess() {
        this.props.shopCartStore.getCartMsg();
        this.refs.GoodsDetailModal.closeModal();
    }

    changeQuantity(isAdd) {
        const { quantity, limitQuantityMin, limitQuantityMax } = this.state;
        if (isAdd) {
            if (limitQuantityMax > 0 && quantity >= limitQuantityMax) {
                return;
            }
        } else if (isAdd === false) {
            if (quantity + "" === "1") {
                return;
            } else if (quantity <= limitQuantityMin) {
                return;
            }
        }
        let newQuantity = quantity;
        if (isAdd) {
            newQuantity++;
        } else {
            newQuantity--;
            if (newQuantity < 1) {
                newQuantity = 1;
            }
        }
        this.setState({
            quantity: newQuantity
        });
    }

    changeAttr(attrIndex, item, callBack) {
        let { skuArray, skuLength } = this.state;
        let newSkuArray = skuArray
        if (attrIndex + '' === '0') {
            newSkuArray = new Array(skuLength);
            newSkuArray[attrIndex] = item.valueId;
        } else {
            newSkuArray = skuArray
            newSkuArray[attrIndex] = item.valueId;
        }
        InteractionManager.runAfterInteractions(() => {
            let flag = true;
            const { data } = this.props.detailStore.goodsDetail[this.state.productId];
            const { spu } = data.productInfo;
            let lastSku = spu;
            for (const iterator of newSkuArray) {
                if (iterator === undefined) {
                    flag = false;
                } else {
                    lastSku += iterator
                }
            }
            if (flag) {
                if (lastSku + '' === this.state.productId) {
                    this.setState({
                        skuArray: newSkuArray,
                    })
                    callBack();
                } else {
                    this.setState({
                        skuArray: newSkuArray,
                        productId: lastSku
                    }, () => this.getGoodsData(lastSku, () => {
                        setTimeout(() => {
                            this.refs.GoodsDetailModal.openModal();
                            callBack();
                        }, 50)
                    }))
                }
            } else {
                this.setState({ skuArray: newSkuArray }, () => callBack && callBack())
            }
        })
    }

    renderImageModal() {
        try {
            const { productInfo } = this.props.detailStore.goodsDetail[
                this.state.productId
            ].data;
            const { detailImages } = productInfo;
            let images = [];
            for (const iterator of detailImages) {
                const { url } = iterator;
                images.push({ url: url });
            }
            return (
                <Modal
                    visible={this.state.openImageModal}
                    transparent={true}
                    onRequestClose={() =>
                        this.setState({ openImageModal: false })
                    }
                >
                    <ImageViewer
                        onCancel={() =>
                            this.setState({ openImageModal: false })
                        }
                        imageUrls={images}
                        onClick={() => this.setState({ openImageModal: false })}
                        saveToLocalByLongPress={false}
                    />
                </Modal>
            );
        } catch (error) { }
    }

    renderFoot() {
        const {
            productInfo,
            unit,
            flashSale
        } = this.props.detailStore.goodsDetail[this.state.productId].data;
        const { limitSellMax, limitQuantityMin } = productInfo;
        const soldOut = limitSellMax + "" === "0" || limitSellMax < limitQuantityMin;
        let flashSaleComming = true;
        try {
            const intStart = parseInt(flashSale.spStartTime || 0) * 1000
            const intCurrent = parseInt(flashSale.spCurrentTime || 0) * 1000
            flashSaleComming = intStart < intCurrent ? false : true;
        } catch (error) {
        }
        return (
            <View style={styles.footView}>
                {soldOut ? (
                    <View style={styles.footBtnWrap}>
                        <TouchableOpacity
                            onPress={() => this.openBuyModal()}
                            style={[
                                styles.sellBtn,
                                { backgroundColor: "#CCCCCC" }
                            ]}
                        >
                            <OText
                                text={"COMMON.STORE_FLASHSALE_SOLDOUT"}
                                style={styles.buyText}
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                        <View style={styles.footBtnWrap}>
                            <TouchableOpacity
                                style={[styles.buyBtn]}
                                onPress={() => this.openBuyModal()}
                            >
                                {flashSaleComming ? <OText
                                    text={"DETAIL.TEXT_DETAIL_UPCOMING"}
                                    style={styles.buyText}
                                />
                                    : <OText
                                        text={"DETAIL.STORE_DETAIL_ADD_TO_CART"}
                                        style={styles.buyText}
                                    />}
                            </TouchableOpacity>
                        </View>
                    )}
                {(!this.props.gift) && <View style={styles.footBtnWrap}>
                    <TouchableOpacity
                        onPress={() => this.openShare()}
                        style={{ flex: 1, marginLeft: Utils.scale(12) }}
                    >
                        <View style={styles.sellBtn}>
                            <OText
                                text={"DETAIL.TEXT_DETAIL_SELL"}
                                style={[styles.buyText, { color: 'white' }]}
                            />
                        </View>
                    </TouchableOpacity>
                </View>}
            </View>
        );
    }

    render() {
        const goodsDetailList = this.props.detailStore.goodsDetail[
            this.state.productId
        ];
        if (goodsDetailList && goodsDetailList.data) {
            const { data } = goodsDetailList;
            const {
                productId,
                quantity,
                skuArray,
                limitQuantityMax,
                limitQuantityMin,
                limitSellMax,
                unit
            } = this.state;
            const { postInfo } = data;
            return (
                <CommonHeader
                    rightView={this.props.gift ? <View /> : <ShopCartIcon viewStyle={{ marginRight: Utils.scale(16), }} />}
                    title={' '}
                >
                    {/* 冻结店铺的提示，这句必须放在最前面，否则无法显示 */}
                    {this.renderToast()}

                    <ScrollView>
                        {/* 轮播大图 */}
                        {this.renderImage()}

                        {/* 价格、商品名等 */}
                        {this.renderDetail()}

                        {/* 包邮、包退等说明 */}
                        <FreeView postInfo={postInfo} unit={unit} />

                        {/* 图片详情 */}
                        {this.renderDetailImage()}


                    </ScrollView>
                    {this.renderFoot()}

                    <GoodsDetailModal
                        limitQuantityMax={limitQuantityMax}
                        limitQuantityMin={limitQuantityMin}
                        limitSellMax={limitSellMax}
                        ref={"GoodsDetailModal"}
                        goodsData={data}
                        productId={productId}
                        quantity={quantity}
                        skuArray={skuArray}
                        addCartFun={() => this.addCartFun()}
                        changeQuantity={isAdd => this.changeQuantity(isAdd)}
                        changeAttr={(index, item, callBack) =>
                            this.changeAttr(index, item, callBack)
                        }
                    />
                    <ShareModal ref={"ShareModal"} />
                    {this.renderImageModal()}
                </CommonHeader>
            );
        }

        return (
            <CommonHeader title={''}>
                {this.renderToast()}
            </CommonHeader>
        );
    }

    renderToast() {
        return (
            <CustomToast
                ref="customtoast"
                fadeInDuration={0}
                fadeOutDuration={0}
            />
        );
    }
}

const styles = StyleSheet.create({
    detailImgView: {
        height: width,
        width: width
    },
    detailImg: {
        height: width - Utils.scale(16),
        width: width - Utils.scale(16),
        borderRadius: Utils.scale(8)
    },
    bulletsContainerStyle: {
        position: "absolute",
        bottom: 0
    },
    chosenBullet: {
        margin: 3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#000000"
    },
    bullet: {
        margin: 3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        borderWidth: 0
    },

    detailView: {
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        paddingBottom: Utils.scale(8),
    },
    sellText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(26),
        fontWeight: "bold",
        textAlignVertical: "bottom",
        marginRight: Utils.scale(8)
    },
    marketText: {
        color: "rgba(153, 153, 153, 1)",
        fontSize: Utils.scaleFontSizeFunc(14),
        lineHeight: Utils.scaleFontSizeFunc(26),
        marginRight: Utils.scale(8),
        textDecorationLine: "line-through"
    },
    bonusText: {
        color: "#FD5F10",
        fontSize: Utils.scaleFontSizeFunc(14),
        lineHeight: Utils.scaleFontSizeFunc(26)
    },
    recommendText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: "#333333",
        marginTop: Utils.scale(11)
    },
    skuNameText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: "#999999",
        marginTop: Utils.scale(7)
    },
    nameText: {
        marginTop: Utils.scale(12),
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(14)
    },
    limTextContainer: {
        flexDirection: "row",
        marginTop: Utils.scale(17),
        color: "#333",
        marginBottom: Utils.scale(20)
    },
    limTextWrap: {
        fontSize: 0,
        width: "auto",
        height: Utils.scale(16),
        borderRadius: Utils.scale(8),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#999999"
    },
    limText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(10),
        paddingLeft: Utils.scale(9),
        paddingRight: Utils.scale(9),
        paddingTop: Utils.scale(2),
        paddingBottom: Utils.scale(2)
    },
    spuInfoDescContainer: {
        width: width,
        marginLeft: Utils.scale(16),
        marginRight: Utils.scale(16)
    },
    spuInfoDescTitle: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(16),
        marginTop: Utils.scale(31),
        marginBottom: Utils.scale(30)
    },
    WebViewWrap: {
        width: width
    },
    detailTitle: {
        fontSize: Utils.scaleFontSizeFunc(16),
        width: "50%",
        color: Constant.blackText,
        fontWeight: "bold",
        marginTop: Utils.scale(20),
        marginBottom: Utils.scale(20)
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: Utils.scale(12)
    },
    detailText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.grayText
    },

    footView: {
        height: Utils.scale(54),
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16)
    },
    footBtnWrap: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: Utils.scale(44),
    },
    buyBtn: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        color: "#FFFFFF",
        height: Utils.scale(44),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Utils.scale(22),
        borderWidth: 1,
        borderColor: "#E5E5E5"
    },
    buyText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: "#333333",
        fontWeight: "bold",
        textAlign: "center"
    },
    sellBtn: {
        flex: 1,
        backgroundColor: Constant.themeText,
        color: "#FFFFFF",
        height: Utils.scale(44),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Utils.scale(22)
    },
    cartCount: {
        width: Utils.scale(20),
        height: Utils.scale(20),
        borderRadius: Utils.scale(10),
        backgroundColor: Constant.themeText,
        right: 0,
        top: 0,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center"
    },
    cartCountText: {
        fontSize: Utils.scaleFontSizeFunc(10),
        color: "white"
    },
    soldOutViewStyle: {
        width: "100%",
        height: "98%",
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    soldOutBg: {
        width: Utils.scale(100),
        height: Utils.scale(100),
        borderRadius: Utils.scale(50),
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center"
    },
    leftCountContainer: {
        position: "absolute",
        left: 0,
        top: 0,
        width: Utils.scale(66),
        height: Utils.scale(20),
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: Utils.scale(12),
        borderTopLeftRadius: 0,
        borderTopRightRadius: Utils.scale(12),
        marginLeft: Utils.scale(16)
    },
    soldOutText: {
        color: "#FFFFFF",
        height: Utils.scale(20),
        lineHeight: Utils.scale(20),
        fontSize: Utils.scaleFontSizeFunc(12),
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    detailTabView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    detailTabText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: Constant.blackText
    }
});
