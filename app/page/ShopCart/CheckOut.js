import React, { Component } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import OText from '../../component/OText/OText';
import * as Constant from "../../utils/Constant"
import { Actions } from 'react-native-router-flux';
import CommonHeader from "../../component/Header/CommonHeader";
import { inject, observer } from 'mobx-react/native';
import * as Api from "../../utils/Api";
import Utils from '../../utils/Utils';
import I18n from '../../config/i18n';
import OrderItemProduct from '../../component/OrderListItem/OrderItemProduct';
import BoldLine from "../../component/BoldLine/BoldLine";
import NetUtils from "../../utils/NetUtils";
import STRIPE from '../../res/images/stripe_pay.png';
import WECHAT from '../../res/img/checkout_pay_wx.png';
import RB_SEL from '../../res/img/rb_select.png';
import RB_NOSEL from '../../res/img/rb_noselect.png';
import LineColor from '../../res/img/line_color.png';
import IconLocation from '../../res/img/icon_location.png';
import ArrowRight from '../../res/img/arrow_right.png';
import AddressItem from "../../component/AddressBook/AddressItem";
import LoadingView from '../../component/LoadingView/LoadingView';

import NativePay from "../../utils/NativePay";
import Toast from "../../component/Toast";
import WarehouseTitle from '../../component/CheckOut/WarehouseTitle';
import PointView from '../../component/CheckOut/PointView';
import CommissionView from '../../component/CheckOut/CommissionView';

const { width, height } = Dimensions.get('window');

export const POINT_STATE_NULL = 'POINT_STATE_NULL';//没有内容可用
export const POINT_STATE_USED = 'POINT_STATE_USED';//正在使用，可改
export const POINT_STATE_USED_DIS = 'POINT_STATE_USED_DIS';//正在使用，不可改
export const POINT_STATE_NOT_USED = 'POINT_STATE_NOT_USED';//没有使用，可改
export const POINT_STATE_NOT_USED_DIS = 'POINT_STATE_NOT_USED_DIS';//没有使用，不可改
import stripe from 'tipsi-stripe';
import { toJS } from 'mobx';



@inject(stores => ({
    shopStore: stores.shopStore,
    shopCartStore: stores.shopCartStore,
}))
@observer
export default class CheckOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selPayment: 0,
            showLoading: false,
            orderId: props.orderId || null,
            paymentArr: [
                {
                    payType: "stripe",
                    img: STRIPE
                },
            ],
            usablePoint: {
                "point": null,
                "commission": null,
                "price": null,
                "priceCNY": null,
                "pointPrice": null,
                "totalCommission": null,
            },
            deducPoint: 0,
            canUsePoint: 0,
            deducCommission: 0,
            canUseComm: 0,
            platformWechat: false,
        };
    }

    componentWillMount() {
        !Constant.isIOS && stripe.setOptions({
            publishableKey: Constant.PAY_ID,
        })
        this.props.shopCartStore.getCheckOutData(this.props.orderId, this.props.gift)
    }

    componentWillUnmount() {
        this.props.shopCartStore.clearCheckOutData()
    }

    pressProductList(houseItem, code, unit) {
        Actions.push('ProductList', { houseItem, unit, code })
    }

    renderProduct() {
        if (this.props.shopCartStore.checkOutData && this.props.shopCartStore.checkOutData.productList && this.props.shopCartStore.checkOutData.productList.length > 0) {
            const { unit, productList } = this.props.shopCartStore.checkOutData;
            return <View >
                {productList.map((houseItem, index) => {
                    const tempProductArr = houseItem.items;
                    const { warehouseCode, } = houseItem;

                    try {
                        if (tempProductArr.length === 1) {
                            return <TouchableOpacity
                                key={index * 10000}
                                onPress={() => this.pressProductList(houseItem, warehouseCode, unit)}
                            >
                                <View
                                    style={[styles.productView]}
                                >
                                    <OrderItemProduct
                                        prodcutItem={tempProductArr[0]}
                                        unit={unit}
                                    />
                                </View>
                                <BoldLine />
                            </TouchableOpacity>
                        } else {
                            return <View style={styles.productView}
                                key={index * 10000}
                            >
                                <WarehouseTitle code={warehouseCode} />
                                <View style={[styles.productHor]}>
                                    <ScrollView
                                        style={styles.productScroll}
                                        horizontal={true}
                                    >
                                        {tempProductArr.map((obj, i) => {
                                            console.log('obj',toJS(obj));
                                            return <Image
                                                key={i}
                                                resizeMode='stretch'
                                                source={{ uri: obj.imgUrl ? obj.imgUrl : '' }}
                                                style={styles.productImage}
                                            />
                                        })}
                                    </ScrollView>
                                    <TouchableOpacity
                                        onPress={() => this.pressProductList(houseItem, warehouseCode, unit)}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: Utils.scale(16), }}>
                                            <OText
                                                text={'CHECKOUT_ITEMS'}
                                                style={[styles.itemsText, { marginRight: Utils.scale(5), }]}
                                                option1={{ num: tempProductArr.length }}
                                            />
                                            <Image style={{
                                                width: Utils.scale(14),
                                                height: Utils.scale(14),
                                            }} source={ArrowRight} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {false && productList.length > 1 && <View style={styles.proHouView}>
                                    <View style={styles.borderText}>
                                        <Text style={{ fontSize: Utils.scaleFontSizeFunc(14), color: Constant.grayText }}>!</Text>
                                    </View>
                                    <OText
                                        text={'CHECKOUT_MULTI_WAREHOUSE_TIPS'}
                                        style={styles.houseText}
                                    />
                                </View>}

                                <BoldLine />
                            </View>
                        }
                    } catch (error) {
                        console.log('+++++++err', error);
                    }
                })}
            </View>
        }

        return <View />
    }

    filterProduct(array) {
        let tempProductsArr = [];
        try {
            for (const iterator of array) {
                const { items } = iterator;
                for (const item of items) {
                    tempProductsArr.push(item);
                }
            }
        } catch (error) {
        }
        return tempProductsArr;
    }

    renderPrice() {
        if (this.props.shopCartStore.checkOutData) {
            const {
                productTotalPrice,
                shippingCost,
                unit,
                commission,
                orderTotal,
                total,
                totalTax,
            } = this.props.shopCartStore.checkOutData;
            const { deducPoint, deducCommission } = this.state;
            let tempOrderTotal = Math.round((orderTotal - (deducPoint / 100) - deducCommission) * 100) / 100
            let freeShip = shippingCost > 0;
            let commissionView = null;
            if (commission && commission > 0) {
                commissionView = <View>
                    <BoldLine />
                    <View style={{
                        flexDirection: 'row',
                        height: Utils.scale(53),
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: Utils.scale(16),
                    }}>
                        <View style={{ flexDirection: 'row', }}>
                            <OText
                                style={{
                                    fontSize: Utils.scaleFontSizeFunc(12),
                                    color: Constant.blackText,
                                    marginLeft: 5
                                }}
                                text={'COMMON.TEXT_COMMISSION_BONUS'}
                            />
                        </View>
                        <Text style={[styles.priceRight, { color: Constant.themeText }]}>+{unit}{commission}</Text>
                    </View>
                    <BoldLine />
                </View>
            }
            return (
                <View>
                    <View style={styles.priceView}>
                        <View style={styles.priceItem}>
                            <OText
                                text={'ORDERDETAIL.ORDER_DETAIL_SUBTOTAL'}
                                style={styles.priceLeft}
                            />
                            <Text style={styles.priceRight}>
                                {unit}{total}
                            </Text>
                        </View>
                        {/* 消费税 */}
                        <View style={styles.priceItem}>
                            <OText
                                text={'CHECKOUT.TEXT_ESTIMATED_TAX'}
                                style={styles.priceLeft}
                            />
                            {totalTax ?
                                <Text style={styles.priceRight}>
                                    {unit}{totalTax}
                                </Text> :
                                <Text
                                    style={styles.priceRight}
                                >
                                {unit}{'0'}
                                </Text>
                            }
                        </View>

                        <View style={styles.priceItem}>
                            <OText
                                text={'COMMON.CHECKOUT_COST'}
                                style={styles.priceLeft}
                            />
                            {freeShip ?
                                <Text style={styles.priceRight}>
                                    {unit}{shippingCost}
                                </Text> :
                                <OText
                                    text={'CHECKOUT_FREE_COST'}
                                    style={styles.priceRight}
                                />
                            }
                        </View>
                        

                        <View style={styles.priceItem}>
                            <OText
                                text={'CHECKOUT_TOTAL'}
                                style={[styles.priceLeft, { fontSize: Utils.scaleFontSizeFunc(14) }]}
                            />
                            <Text style={[styles.priceRight, { fontSize: Utils.scaleFontSizeFunc(20) }]}>
                                {unit}{tempOrderTotal}
                            </Text>
                        </View>
                    </View>
                    {commissionView}
                </View>
            )
        }
    }

    renderPayment() {
        const { paymentArr, selPayment, platformWechat } = this.state;
        return <View style={styles.priceView}>
            <OText
                text={'STORE_CHECKOUT_PAYMENT_METHOD'}
                style={styles.paymentText}
            />
            {paymentArr.map((obj, i) => {
                const isSel = selPayment + '' === i + '';
                const selIcon = isSel ? RB_SEL : RB_NOSEL;

                if (obj.payType === 'weixin' && !platformWechat) {
                    return <View key={i} />;
                } else {
                    return <TouchableOpacity
                        key={i}
                        disabled={isSel}
                        onPress={() => this.setState({ selPayment: i })}
                    >
                        <View style={styles.paymentItem}>
                            <Image source={selIcon} style={{ marginRight: 16 }} />
                            <Image source={obj.img} />
                        </View>
                    </TouchableOpacity>
                }
            })}
        </View>
    }

    renderFootBold() {
        return <View style={{ height: 20, width: '100%' }} />
    }

    renderFoot() {
        if (this.props.shopCartStore.checkOutData) {
            const {
                orderTotal,
                unit,
                exchangeRate
            } = this.props.shopCartStore.checkOutData;
            const { deducPoint, deducCommission } = this.state;
            let tempOrderTotal = Math.round((orderTotal - (deducPoint / 100) - deducCommission) * 100) / 100
            let text = ' ' + unit + '' + tempOrderTotal;
            if (this.state.selPayment + '' === '0') {
                let tempCNy = Math.round(tempOrderTotal * exchangeRate * 100) / 100
                text = " ¥ " + tempCNy + "(" + text + ")"
            }
            return (
                <View style={styles.bottomView}>
                    <View style={styles.totalPriceView}>
                        <OText
                            style={styles.checkOutLeftTop}
                            text={'COMMON.TEXT_ALL_TOTAL'}
                        />
                        <Text style={styles.totalPrice}>{unit}{orderTotal}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => this.pressCheckOut()}
                    >
                        <View style={styles.checkoutBtn}>
                            <OText
                                style={styles.checkoutText}
                                text={'CART.CART_CHECKOUT'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    async toPay(orderId) {
        try {
            const token = await stripe.paymentRequestWithCardForm();
            this.setState({
                showLoading: false,
            }, () => {
                const payParams = {
                    businessType: 1,
                    orderId,
                    payType: "stripe",
                    token: token.tokenId
                };
                NetUtils.post(Api.PAY_ORDER, payParams).then((payResult) => {
                    this.setState({
                        showLoading: false,
                    });
                    if (payResult && payResult.data) {
                        Actions.replace('PaySuccess', { orderId: orderId })
                    } else {
                        this.toOrderList()
                    }
                }).catch((e) => {
                    this.setState({
                        showLoading: false,
                    }, () => {
                        this.toOrderList()
                    })

                });
            });
        } catch (error) {
            this.toOrderList()
        }

    }

    toOrderList() {
        if (this.props.orderId) {
            Actions.pop()
        } else {
            Actions.reset('HomePage')
            setTimeout(() => {
                Actions.push('OrderList')
            }, 1000)
        }
    }

    handlePay(payData, payType) {
        this.props.shopCartStore.getCartData();
        if (payType === 'paypal' && payData.paypal) {
            const { payInfo } = payData.paypal;
            let info = JSON.parse(payInfo);
            const { redirectUrl } = info;
            Actions.replace('OCWebView', { url: redirectUrl, title: I18n("CHECKOUT_PAY") })
        } else if (payData.wechat) {
            this.startNativePay(payData.wechat, this.state.orderId);
        }
    }

    startNativePay(wechatData, orderId) {
        NativePay.weChatPay(wechatData).then((msg) => {
            Actions.replace('PaySuccess', { orderId: orderId })
        }).catch((error) => {
            if (error.code === '-999') {
                Toast.show(I18n('APP_INSTALL_WECHAT'));
            } else {
                Toast.show(error.message);
            }
        });
    }

    pressCheckOut() {
        const { checkOutData } = this.props.shopCartStore

        let isPhoneUs = Utils.isPhoneUs(checkOutData.address.phone);
        if(!isPhoneUs){
            Toast.show(I18n('ADDRESS.ADDRESS_PHONE_ERROR'));
            return
        }

        const { paymentArr, selPayment, } = this.state;

        if (this.props.orderId) {
            this.toPay(this.props.orderId);
            return
        }

        if (checkOutData.address && checkOutData.address.addressId) {
            let params = {
                deducCommission: 0,
                addressId: checkOutData.address.addressId,
                orderType: this.props.gift ? 4 : 1,
                payType: paymentArr[selPayment].payType,
                storeId: this.props.shopStore.storeInfo ? this.props.shopStore.storeInfo.storeId : '',
            };
            this.setState({
                showLoading: true,
            }, () => {
                NetUtils.post(Api.UNIFIED_ORDER, params).then((result) => {
                    if (result && result.data && result.data.orderId) {
                        this.setState({ orderId: result.data.orderId });
                        this.toPay(result.data.orderId)
                    }
                }).catch((e) => {
                    this.setState({
                        showLoading: false,
                    })
                    if (e.code && e.code + '' === '5106') {
                        Actions.pop()
                    }
                });
            })
        }
    }

    renderDeduction() {
        try {
            if (this.state.orderId) {
                const { checkOutData } = this.state;
                const { commissionPrice, pointPrice, percent } = checkOutData;
                let commState = POINT_STATE_NOT_USED_DIS
                if (commissionPrice && commissionPrice > 0) {
                    commState = POINT_STATE_USED_DIS
                }

                let pointState = POINT_STATE_NOT_USED_DIS
                if (pointPrice && pointPrice > 0) {
                    pointState = POINT_STATE_USED_DIS
                }
                let viewArr = [];
                pointPrice && viewArr.push(<PointView
                    key={'PointView'}
                    usableState={pointState}
                    unit={unit}
                    point={pointPrice ? Math.round(pointPrice * 100) : 0}
                    percent={percent}
                />)
                commissionPrice && viewArr.push(<CommissionView
                    key={'CommissionView'}
                    usableState={commState}
                    unit={unit}
                    commission={commissionPrice || 0}
                    percent={percent}
                />)
                if (viewArr.length > 0) {
                    return (
                        <View>
                            {viewArr}
                            <BoldLine />
                        </View>
                    )
                } else {
                    return <View />
                }
            }
            const { checkOutData } = this.state;
            const { percent } = checkOutData;
            const {
                usablePoint,
                deducPoint,
                deducCommission,
                canUsePoint,
                canUseComm,
            } = this.state;
            let unit = '$'
            try {
                unit = this.props.shopCartStore.checkOutData.unit;
            } catch (error) {
            }
            const {
                point,
                commission,
                totalCommission,
            } = usablePoint;
            let pointState = POINT_STATE_NULL;
            let commissionState = POINT_STATE_NULL;
            if (point != null && point > 0) {
                if (deducPoint > 0) {
                    pointState = POINT_STATE_USED
                } else if (canUsePoint == 0) {
                    pointState = POINT_STATE_NOT_USED_DIS
                } else {
                    pointState = POINT_STATE_NOT_USED
                }
            }
            if (commission != null && commission > 0) {
                if (deducCommission > 0) {
                    commissionState = POINT_STATE_USED
                } else if (canUseComm == 0) {
                    commissionState = POINT_STATE_NOT_USED_DIS
                } else {
                    commissionState = POINT_STATE_NOT_USED
                }
            }
            //console.log('0000000', deducPoint, canUsePoint);
            //console.log('1111111', deducCommission, canUseComm);
            return (
                <View>
                    <PointView
                        usableState={pointState}
                        point={deducPoint || canUsePoint}
                        unit={unit}
                        press={(isOpen) => this.setDeduc(true, isOpen)}
                        percent={percent}
                    />
                    <CommissionView
                        usableState={commissionState}
                        commission={deducCommission || canUseComm}
                        unit={unit}
                        press={(isOpen) => this.setDeduc(false, isOpen)}
                        percent={percent}
                    />
                    <BoldLine />
                </View>
            )
        } catch (error) {
            return <View />
        }
    }

    setDeduc(isPoint = false, isOpen = true) {
        const {
            usablePoint,
            deducPoint,
            deducCommission,
            canUsePoint,
            canUseComm,
            checkOutData
        } = this.state;
        const {
            orderTotal,
            percent
        } = checkOutData;
        const {
            point,
            commission,
            totalCommission,
        } = usablePoint;
        const total = parseInt(orderTotal * 100 * percent);
        let tempDeducPoint = 0;
        let tempCanUsePoint = 0;
        let tempDeducCommission = 0;
        let tempCanUseComm = 0;
        if (isPoint) {
            if (isOpen) {
                let isOver = ((total) - Math.round((deducCommission * 100)));
                tempDeducPoint = point > isOver ? isOver : point;
                tempDeducCommission = deducCommission;
                let maxCommission = ((total) - tempDeducPoint) / 100;
                tempCanUseComm = maxCommission > commission ? commission : maxCommission;
                tempCanUsePoint = tempDeducPoint
            } else {
                tempDeducPoint = 0;
                if (deducCommission > 0) {
                    tempDeducCommission = commission;
                    tempCanUseComm = commission
                    tempCanUsePoint = (total) - (tempDeducCommission * 100)
                } else {
                    tempCanUsePoint = point;
                    tempCanUseComm = commission;
                }
            }
        } else {
            if (isOpen) {
                let isOver = (total - deducPoint) / 100
                tempDeducCommission = commission > isOver ? isOver : commission;
                tempDeducPoint = deducPoint;
                let maxPoint = ((total) - Math.round((tempDeducCommission * 100)));
                tempCanUsePoint = maxPoint > point ? point : maxPoint
                tempCanUseComm = tempDeducCommission
            } else {
                tempDeducCommission = 0;
                if (deducPoint > 0) {
                    tempCanUsePoint = point;
                    tempDeducPoint = point;
                    tempCanUseComm = ((total) - tempDeducPoint) / 100;
                } else {
                    tempCanUsePoint = point;
                    tempCanUseComm = commission;
                }
            }
        }
        //console.log('++++++', tempDeducPoint, tempDeducCommission, tempCanUseComm, tempCanUsePoint);
        this.setState({
            deducPoint: tempDeducPoint,
            deducCommission: tempDeducCommission,
            canUseComm: tempCanUseComm,
            canUsePoint: tempCanUsePoint,
        })
    }

    render() {
        return (
            <CommonHeader
                title={I18n('CHECKOUT.CHECKOUT_TITLE')}
            >
                <ScrollView>
                    <Image style={styles.lineColor} source={LineColor} />
                    {this.renderAdress()}
                    <BoldLine />
                    {this.renderProduct()}
                    {this.renderDeduction()}
                    {this.renderPrice()}
                    <BoldLine />
                    {this.renderPayment()}
                    {this.renderFootBold()}
                </ScrollView>
                {this.renderFoot()}
                {
                    this.state.showLoading ? (
                        <LoadingView cancel={() => this.setState({ showLoading: false })} />
                    ) : (null)
                }
            </CommonHeader>
        );
    }

    renderAdress() {
        if (this.props.shopCartStore.checkOutData) {
            const { address } = this.props.shopCartStore.checkOutData;
            const disabled = !!this.state.orderId;
            let addressView = address && address.addressId ?
                <TouchableOpacity
                    style={styles.addressTouchLay}
                    onPress={() => this.toAddressBook(address)}
                    disabled={disabled}
                >
                    <AddressItem
                        item={address}
                        showArrow={!disabled}
                    />
                </TouchableOpacity>
                :
                <TouchableOpacity
                    style={styles.addressTouchLay}
                    onPress={() => this.toEditPage()}
                >
                    <View style={styles.addressEmptyLay}>
                        <Image style={styles.iconLocation} source={IconLocation} />
                        <OText
                            style={styles.addressEmptyText}
                            text={'STORE_CHECKOUT_ADDRESS'}
                        />
                        <Image style={styles.arrowRight} source={ArrowRight} />
                    </View>
                </TouchableOpacity>;

            return (
                <View>
                    {addressView}
                </View>
            )
        }
    }

    toEditPage() {
        Actions.push("AddressEdit", {
            setDefault: true,
            callBack: (address) => this.setNewAddress(address)
        })
    }

    toAddressBook(address) {
        Actions.push('AddressBook', {
            checkOutData: address,
            callBack: (address) => this.setNewAddressBack(address)
        })
    }

    setNewAddressBack(address){
        Actions.popTo('CheckOut');
        this.setNewAddress(address)
    }

    setNewAddress(address) {
        this.props.shopCartStore.setCheckOutAddress(address)
    }
}

const styles = StyleSheet.create({
    lineColor: {
        width: '100%',
        height: Utils.scale(6),
    },
    arrowRight: {
        width: Utils.scale(14),
        height: Utils.scale(14),
        position: 'absolute',
        right: Utils.scale(16),
        top: Utils.scale(60)
    },
    iconLocation: {
        width: Utils.scale(18),
        height: Utils.scale(23),
    },
    addressEmptyLay: {
        width: '100%',
        height: Utils.scale(125),
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: Utils.scale(16),
        paddingLeft: Utils.scale(16),
    },
    addressTouchLay: {
        paddingBottom: Utils.scale(10)
    },
    addressEmptyText: {
        color: Constant.lightText,
        fontSize: Utils.scaleFontSizeFunc(14),
        marginLeft: Utils.scale(12),
    },
    itemsText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.blackText,
        margin: Utils.scale(16),
    },
    priceView: {
        margin: Utils.scale(16),
    },
    priceItem: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    priceLeft: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.grayText,
    },
    priceRight: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.blackText,
    },
    paymentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Utils.scale(6),
        paddingBottom: Utils.scale(6)
    },
    paymentText: {
        fontSize: Utils.scaleFontSizeFunc(16),
        color: Constant.blackText,
        marginBottom: 8
    },
    productView: {
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    productScroll: {
        width: Utils.scale(254),
        height: Utils.scale(83),
        paddingLeft: Utils.scale(16),
    },
    productImage: {
        width: Utils.scale(66),
        height: Utils.scale(83),
        borderRadius: Utils.scale(4),
        marginRight: Utils.scale(12),
    },
    productHor: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Utils.scale(123),
    },
    proHouView: {
        marginLeft: Utils.scale(16),
        marginRight: Utils.scale(16),
        marginBottom: Utils.scale(16),
        flexDirection: 'row',
    },
    houseText: {
        color: Constant.grayText,
        fontSize: Utils.scale(12),
        width: '90%'
    },
    borderText: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Constant.grayText,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    shipView: {
        flexDirection: 'row',
        marginBottom: Utils.scale(20),
        marginLeft: Utils.scale(16),
        marginRight: Utils.scale(16),
        justifyContent: 'space-between'
    },
    shipText: {
        color: Constant.blackText,
        fontSize: Utils.scale(12),
    },
    totalPriceView: {
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    totalPrice: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(16),
        fontWeight: 'bold',
        marginTop: Utils.scale(3),
    },
    checkoutBtn: {
        backgroundColor: Constant.themeText,
        width: Utils.scale(100),
        height: Utils.scale(42),
        borderRadius: Utils.scale(21),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Utils.scale(16),
        marginLeft: Utils.scale(16),
    },
    checkoutText: {
        color: 'white',
        fontSize: Utils.scaleFontSizeFunc(14),
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center',
    },
    bottomView: {
        width: '100%',
        height: Utils.scale(54),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
        paddingLeft: Utils.scale(16),
    },
    checkOutLeftTop: {
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(10),
    }
});
