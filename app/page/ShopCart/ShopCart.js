/**
 * Created by Neal on 2017/4/28.
 */

'use strict';
import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    RefreshControl,
    Alert,
    InteractionManager
} from 'react-native';
// import * as Api from '../../utils/Api';
import CommonHeader, { NAVIGATION_BACK } from '../../component/Header/CommonHeader';
import { inject, observer } from 'mobx-react/native';
import Utils from '../../utils/Utils';
import * as Constant from '../../utils/Constant'
import ShopCartItem from '../../component/ShopCartItem/ShopCartItem';
import CartItemSoldOut from '../../component/CartItemSoldOut/CartItemSoldOut';
import I18n from '../../config/i18n'
import OText from '../../component/OText/OText'
import { Actions } from 'react-native-router-flux';
import EMPTY_CART from '../../res/images/cart_empty.png';
import TIPS_ICON from '../../res/img/point_detail.png';
import Toast, { FAIL } from '../../component/GoodsDetailModal/Toast';
import ShipModal from '../../component/ShipModal/ShipModal';
import moment from 'moment';
import CountTime from '../../utils/CountTime';
import { toJS } from 'mobx';

@inject(stores => ({
    shopCartStore: stores.shopCartStore,
    shopStore: stores.shopStore,
    homeStore: stores.homeStore,
    detailStore: stores.goodsDetailStore,
}))
@observer
export default class ShopCart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkOutDisable: false,
            timerCount: null,
            countdownObj: {
                DD: '',
                HH: '',
                MM: '',
                SS: ''
            },
        }
    }

    componentWillMount() {
        this.props.shopCartStore.getCartData();
    }

    /**
     * 
     * @param {*} obj 
     * @param {*} type  1加   2减   3删除
     */
    pressModifly(obj, type) {
        if (type + '' === '3' || (type + '' === '2' && obj.quantity + '' === '1')) {
            Alert.alert('', I18n('CART.CART_DELETE'),
                [{ text: I18n('CART.CART_DELETE_NO'), },
                { text: I18n('CART.CART_DELETE_YES'), onPress: () => this.modiflyProduct(obj, 3) }
                ])
        } else {
            this.modiflyProduct(obj, type)
        }
    }

    modiflyProduct(obj, type) {
        const { sku, quantity, spId } = obj;
        let newQuantity = quantity
        if (type + '' === '3') {
            this.props.shopCartStore.deleteGoods(sku, spId)
        } else if (type + '' === '2') {
            this.props.shopCartStore.modifyProduct(sku, --newQuantity, spId)
        } else {
            this.props.shopCartStore.modifyProduct(sku, ++newQuantity, spId)
        }
    }

    deleteFailure() {
        this.props.shopCartStore.clearInvlidList()
    }

    renderProductList() {
        if (this.props.shopCartStore.productList && this.props.shopCartStore.productList.length > 0) {
            const { unit } = this.props.homeStore
            return <View style={styles.listStyle}>
                {this.props.shopCartStore.productList.map((warehouseList, index) => {
                    const {
                        specialList,
                    } = warehouseList;
                    if (specialList && specialList.length > 0) {
                        return <View key={index}>
                            {this.renderWarehouse(warehouseList, unit)}
                            {specialList.map((spList, spIndex) => {
                                return this.renderDiscountView(spList, spIndex)
                            })}
                        </View>
                    } else {
                        return <View />
                    }
                })}
            </View>
        }
        return null;
    }

    renderWarehouse(house, unit) {
        const { warehouseShippingThreshold, warehouseTotal } = house;
        let price =
            parseInt(
                warehouseShippingThreshold * 100 - warehouseTotal * 100
            ) / 100;
        if (price > 0) {
            return <View >
                <View style={{ flexDirection: 'row', marginBottom: Utils.scale(15), paddingLeft: Utils.scale(16) }}>
                    <Image source={TIPS_ICON} style={{ marginRight: 5 }} />
                    <OText
                        style={styles.shipText}
                        text='CART.CART_SHIP_1'
                        option1={{
                            unit,
                            price: warehouseShippingThreshold
                        }}
                    />
                    <OText
                        style={styles.shipText}
                        text='CART.CART_SHIP_2'
                        option1={{
                            unit,
                            price
                        }}
                    />
                    <OText
                        style={styles.shipText}
                        text='CART.CART_SHIP_3'
                    />
                </View>
                <View style={{
                    width: '100%',
                    height: Utils.scale(10),
                    backgroundColor: Constant.boldLine,
                }}
                />
            </View>
        } else {
            return <View>
                <OText
                    text='CART.CART_SHIP_4'
                    style={[styles.shipText, { marginLeft: Utils.scale(16), marginBottom: Utils.scale(15), }]}
                    option1={{
                        unit,
                        price: warehouseShippingThreshold
                    }}
                />
                <View style={{
                    width: '100%',
                    height: Utils.scale(10),
                    backgroundColor: Constant.boldLine,
                }}
                />
            </View>
        }
    }

    renderDiscountView(spList, spIndex) {
        const { unit } = this.props.homeStore
        const {
            commodityList,
            spgId,
            rulePiece,
            rulePrice,
            status,
            discount
        } = spList;
        if (rulePiece != null && rulePrice != null) {
            return <View
                key={spIndex + '' + spgId}
                style={{ paddingLeft: Utils.scale(16), overflow: 'hidden' }}
            >
                <View style={styles.saleLine} />
                <View style={styles.saleView}>
                    <View style={styles.saleBG}>
                        <Text style={styles.saleText}>SALE</Text>
                    </View>
                    {status + '' === '1' ? <OText
                        style={styles.saleDetailText}
                        text="CART.CART_PIECES_DETAIL"
                        option1={{
                            unit,
                            rulePiece,
                            rulePrice,
                            discount
                        }}
                    /> : <OText
                            style={styles.saleDetailText}
                            text="COMMON.TEXT_ONSALE_RULES"
                            option1={{
                                unit,
                                count: rulePiece,
                                value: rulePrice,
                            }}
                        />}
                </View>
                <View style={{ paddingLeft: Utils.scale(16) }}>
                    {commodityList.map((item, itemIndex) => {
                        return <ShopCartItem
                            key={itemIndex * 1000}
                            data={item}
                            unit={unit}
                            pressAdd={() => this.pressModifly(item, 1)}
                            pressDecrease={() => this.pressModifly(item, 2)}
                            pressDelete={() => this.pressModifly(item, 3)}
                        />
                    })}
                </View>
            </View>
        }
        return <View
            key={spIndex + '' + spgId}
            style={{ paddingLeft: Utils.scale(16) }}
        >
            {commodityList.map((item, itemIndex) => {
                return <ShopCartItem
                    key={itemIndex * 1000}
                    data={item}
                    unit={unit}
                    pressAdd={() => this.pressModifly(item, 1)}
                    pressDecrease={() => this.pressModifly(item, 2)}
                    pressDelete={() => this.pressModifly(item, 3)}
                />
            })}
        </View>

    }

    renderFailureList() {
        if (this.props.shopCartStore.failureList && this.props.shopCartStore.failureList.length > 0) {
            const { unit } = this.props.homeStore
            return <View style={styles.outList}>
                <View style={styles.soldOutView}>
                    <OText
                        style={styles.soldText}
                        text={'CART.STORE_CART_SOLD_OUT_BANNER'}
                    />
                    <TouchableOpacity onPress={() => this.deleteFailure()}>
                        <OText
                            style={styles.soldText}
                            text={'CART_CLEAR_ALL'}
                        />
                    </TouchableOpacity>
                </View>

                {this.props.shopCartStore.failureList.map((obj, index) => {
                    return (<CartItemSoldOut
                        key={index}
                        data={obj}
                        unit={unit}
                        addAgainFun={() => this.addAgain(obj)}
                    />)
                })}
            </View>
        }
        return null;
    }

    addAgain(obj) {
        const { spgMinimum, sku, spId } = obj;
        let params = {
            quantity: spgMinimum || 1,
            sku,
            spId
        }
        this.props.detailStore.addToCart(
            params,
            () => this.onRefresh()
        );
    }

    onRefresh() {
        try {
            this.props.shopCartStore.getCartData();
        } catch (error) {
        }
    }

    checkOutFun() {
        this.toCheckOut();
    }

    showToast(text) {
        this.refs.toast.show(text, 2000, null, FAIL);
    }

    toCheckOut() {
        Actions.push('CheckOut');
    }

    renderFoot() {
        if (this.props.shopCartStore.productList && this.props.shopCartStore.productList.length > 0) {
            const { unit } = this.props.homeStore
            const { total, getProductCount } = this.props.shopCartStore

            const canCheckOut = !this.canCheckOut();
            return (
                <View style={styles.bottomView}>
                    <View style={styles.totalPriceView}>
                        <OText
                            style={styles.itemsText}
                            text={'CART.CART_TOTAL'}
                            option1={{ quantity: getProductCount }}
                        />
                        <Text style={styles.totalPrice}> {unit}{total}</Text>
                    </View>

                    <TouchableOpacity
                        disabled={canCheckOut}
                        onPress={() => this.checkOutFun()}
                    >
                        <View style={canCheckOut ?
                            [styles.checkoutBtn, {
                                backgroundColor: '#999999'
                            }] : styles.checkoutBtn}>
                            <OText
                                style={canCheckOut ? [styles.checkoutText, { color: Constant.blackText }] : styles.checkoutText}
                                text={'CART.CART_CHECKOUT'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    canCheckOut() {
        return this.props.shopCartStore.productList.length > 0
    }

    toHomePage() {
        Actions.reset("HomePage")
    }

    renderList() {
        let proList = this.renderProductList();
        let failList = this.renderFailureList();
        let emptyStyle = null;
        let showEmpty = false;
        if (proList == null && failList == null) {
            emptyStyle = styles.emptyFull;
            showEmpty = true
        } else if (proList == null && failList != null) {
            emptyStyle = [styles.emptyFull, { height: Utils.scale(360), backgroundColor: 'white' }];
            showEmpty = true
        }
        let emptyView = showEmpty && <View style={emptyStyle}>
            <Image
                source={EMPTY_CART}
                style={{
                    width: Utils.scale(120),
                    height: Utils.scale(120),
                }}
            />
            <OText
                style={styles.emptyText}
                text={'CART.STORE_CART_EMPTY'}
            />
            <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => this.toHomePage()}
            >
                <OText
                    style={styles.emptyBtnText}
                    text={'CART.CART_SHOPPING'}
                />
            </TouchableOpacity>
        </View>
        return (
            <View >
                {emptyView}
                {proList}
                {failList}
            </View>
        )
    }

    renderTime() {
        try {
            const { shopCartStore } = this.props;
            const { timerCount, cartMsg } = shopCartStore;
            if (timerCount > 0 && cartMsg && cartMsg.commodityTotal > 0) {
                return (
                    <Text style={{ color: Constant.themeText, marginLeft: Utils.scale(4), }}>
                        {Utils.transformTime(timerCount).MM}:{Utils.transformTime(timerCount).SS}
                    </Text>
                );
            }
            return null
        } catch (error) {
            return null
        }
    }

    renderTitle() {
        let countText = this.renderTime();
        return <OText
            style={{
                color: Constant.blackText,
                fontSize: Utils.scaleFontSizeFunc(17),
                fontWeight: 'bold',
            }}
            text={'CART.STORE_SALE_LIST_CART'}>
            {countText}
        </OText>
    }

    render() {
        return (
            <CommonHeader
                showDivider={false}
                titleType={NAVIGATION_BACK}
                titleView={this.renderTitle()}
                containerStyles={!this.props.showBack && { paddingBottom: 0 }}
            >
                <ScrollView
                    style={styles.scrollBg}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.shopCartStore.isRefreshing}
                            onRefresh={() => this.onRefresh()}
                            tintColor={Constant.themeText}
                        />
                    }>
                    {this.renderList()}
                </ScrollView>
                {this.renderFoot()}
                <Toast ref="toast" />
                <ShipModal ref="shipModal" />
            </CommonHeader>
        )
    }
}

let styles = StyleSheet.create({
    headBackground: {
        width: "100%",
        height: Utils.scale(250),
        alignItems: 'center',
        justifyContent: 'center',
    },
    headTouch: {
        width: Utils.scale(90),
        height: Utils.scale(90),
        marginTop: Utils.scale(12),
    },
    headImage: {
        borderRadius: Utils.scale(45),
    },
    storeNameStyle: {
        fontSize: Utils.scaleFontSizeFunc(20),
        color: 'white',
        marginTop: Utils.scale(20),
    },
    storeNote: {
        fontSize: Constant.smallSize,
        color: 'white',
        marginTop: Utils.scale(5),
    },
    shareBtn: {
        width: Utils.scale(70),
        height: Utils.scale(27),
        borderTopLeftRadius: Utils.scale(14),
        borderBottomLeftRadius: Utils.scale(14),
        backgroundColor: Constant.themeText,
        position: 'absolute',
        top: 10,
        right: 0
    },
    shareView: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    shareText: {
        color: 'white',
        fontSize: Constant.miniSize,
    },
    shareIcon: {
        width: Utils.scale(14),
        height: Utils.scale(14),
        marginRight: Utils.scale(4),
    },
    scrollBg: {
        backgroundColor: 'white'
    },
    listStyle: {
        paddingBottom: Utils.scale(20),
    },
    outList: {
        paddingLeft: Utils.scale(16),
        paddingTop: Utils.scale(16),
        backgroundColor: '#f2f2f2',
        paddingBottom: Utils.scale(16),
    },
    listText: {
        color: Constant.blackText,
        fontSize: Constant.largeSize
    },
    soldOutView: {
        paddingRight: Utils.scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    soldText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(13)
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
    itemsText: {
        color: Constant.lightText,
        fontSize: Utils.scaleFontSizeFunc(10),
        marginBottom: Utils.scale(5),
    },
    totalPriceView: {
        width: "60%",
        justifyContent: 'center',
        height: '100%'
    },
    totalPrice: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(16),
        fontWeight: 'bold',
        width: Utils.scale(100),
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
    emptyFull: {
        width: '100%',
        height: Utils.scale(450),
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyText: {
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(14),
        marginTop: Utils.scale(18),
    },
    emptyBtn: {
        width: Utils.scale(120),
        height: Utils.scale(32),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Utils.scale(16),
        backgroundColor: Constant.themeText,
        marginTop: Utils.scale(29),
    },
    emptyBtnText: {
        color: 'white',
        fontSize: Utils.scaleFontSizeFunc(14)
    },
    houseText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(14),
        fontWeight: 'bold',
        marginLeft: Utils.scale(8),
        width: '80%'
    },
    shipText: {
        fontSize: Utils.scaleFontSizeFunc(12),
        color: Constant.blackText,
    },
    saleBG: {
        width: 44,
        height: 18,
        borderRadius: 9,
        borderBottomLeftRadius: 0,
        backgroundColor: Constant.themeText,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Utils.scale(10),
    },
    saleView: {
        flexDirection: 'row',
        marginTop: Utils.scale(16),
    },
    saleText: {
        color: 'white',
        fontSize: Utils.scaleFontSizeFunc(12),
    },
    saleDetailText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(12),
        width: Utils.scale(288),
    },
    saleLine: {
        borderStyle: "dashed",
        borderColor: Constant.themeText,
        borderWidth: StyleSheet.hairlineWidth,
        width: 0.5,
        height: "100%",
        position: "absolute",
        top: Utils.scale(22),
        left: Utils.scale(16),
    }
});