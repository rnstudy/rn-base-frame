import { observable, action, runInAction, useStrict, toJS, computed } from 'mobx';
import {
    DeviceEventEmitter,
} from 'react-native';
import NetUtils from '../utils/NetUtils';
import * as Api from '../utils/Api';
import ShopStore from './ShopStore';
import * as mobx from "mobx";
import * as Constant from "../utils/Constant";

import moment from 'moment';
import Utils from '../utils/Utils';

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed" });

class ShopCartStore {

    @observable productList = [];
    @observable failureList = [];
    @observable cartMsg = null;
    @observable isRefreshing = false;
    @observable timerCount = 0;
    @observable total = 0;
    @observable checkOutData = null;
    systemTime = null;

    constructor() {
    }

    /**
     * 重置
     */
    @action
    resetCart() {
        this.productList = [];
        this.failureList = [];
        this.isRefreshing = false;
    }

    /**
     * 获取购物车信息
     */
    @action
    getCartMsg() {
        try {
            const { storeId } = ShopStore.storeInfo
            this.isRefreshing = true;
            let params = {
                storeId,
                orderType: 1
            }
            NetUtils.get(Api.SHOP_CART_MSG, params, false).then((result) => {
                if (result && result.data) {
                    const { data } = result;
                    runInAction(() => {
                        this.cartMsg = data
                        const { vaildTime, systemTime } = data
                        this.systemTime = systemTime;
                        let temp = (moment(vaildTime) - moment(systemTime)) / 1000;
                        this.countTimeFun(temp, systemTime)
                        this.isRefreshing = false;
                    })
                }
            }).catch((e) => {
                runInAction(() => {
                    this.isRefreshing = false;
                })
            })
        } catch (error) {
            runInAction(() => {
                this.isRefreshing = false;
            })
        }
    }

    countTimeFun(temp, systemTime) {
        if (temp > 0) {
            this.timerCount = temp;
            if (this.systemTime == systemTime) {
                setTimeout(() => {
                    let newCountTime = this.timerCount - 1;
                    if (newCountTime <= 0) {
                        this.getCartMsg()
                        runInAction(() => {
                            this.timerCount = 0;
                        })
                    } else {
                        runInAction(() => {
                            Utils.transformTime(newCountTime)
                            this.timerCount = newCountTime
                            this.countTimeFun(newCountTime, systemTime)
                        })
                    }
                }, 1000)
            }
        }
    }


    /**
     * 获取购物车列表
     */
    @action
    getCartData() {
        this.getCartMsg()
        try {
            const { storeId } = ShopStore.storeInfo
            this.isRefreshing = true;
            const params = {
                storeId,
                currentPage: 1,
                numsPerPage: 60
            }
            NetUtils.get(Api.SHOP_CART_LIST, params).then((result) => {
                if (result && result.data) {
                    const { data } = result;
                    const { warehouseList, total } = data;
                    runInAction(() => {
                        this.productList = warehouseList;
                        this.total = total;
                        this.getInvalidList()
                    })
                } else {

                }
            }).catch((e) => {
                runInAction(() => {
                    this.productList = [];
                    this.total = 0;
                    this.getInvalidList()
                })
            })
        } catch (error) {
            runInAction(() => {
                this.getInvalidList()
            })
        }
    }

    /**
     * 获取失效列表
     */
    @action
    getInvalidList() {
        const { storeId } = ShopStore.storeInfo
        this.isRefreshing = true;
        const params = {
            storeId,
            currentPage: 1,
            numsPerPage: 60
        }
        NetUtils.get(Api.SHOP_CART_INVALID_LIST, params).then((result) => {
            runInAction(() => {
                if (result && result.data) {
                    this.failureList = result.data
                }
                this.isRefreshing = false;
            })

        }).catch((e) => {
            runInAction(() => {
                this.isRefreshing = false;
            })
        })
    }

    /**
     * 更变购物车商品数据
     */
    @action
    modifyProduct(sku, quantity, spId) {
        if (this.isRefreshing) return;
        this.isRefreshing = true;
        try {
            const { storeId } = ShopStore.storeInfo
            let params = {
                storeId,
                sku,
                quantity,
                spId
            }
            NetUtils.post(Api.SHOP_CART_NUMBER_CHANGE, params).then(() => {
                runInAction(() => {
                    this.getCartData()
                })
            }).catch((e) => {
                runInAction(() => {
                    this.isRefreshing = false;
                })
            })
        } catch (error) {
            runInAction(() => {
                this.isRefreshing = false;
            })
        }
    }


    /**
     * 删除商品
     */
    @action
    deleteGoods(sku, spId) {
        if (this.isRefreshing) return;
        this.isRefreshing = true;
        try {
            const { storeId } = ShopStore.storeInfo
            let params = {
                storeId,
                sku: [{ sku, spId }],
            }
            NetUtils.postJson(Api.SHOP_CART_REMOVE_COMMODITY, params).then(() => {
                runInAction(() => {
                    this.getCartData()
                })
            }).catch((e) => {
                runInAction(() => {
                    this.isRefreshing = false;
                })
            })
        } catch (error) {
            runInAction(() => {
                this.isRefreshing = false;
            })
        }
    }

    /**
     * 删除商品
     */
    @action
    clearInvlidList() {
        if (this.isRefreshing) return;
        this.isRefreshing = true;
        try {
            const { storeId } = ShopStore.storeInfo
            let params = {
                storeId,
            }
            NetUtils.post(Api.SHOP_CART_CLEAN_COMMODITY, params).then(() => {
                runInAction(() => {
                    this.getInvalidList()
                })
            }).catch((e) => {
                runInAction(() => {
                    this.isRefreshing = false;
                })
            })
        } catch (error) {
            runInAction(() => {
                this.isRefreshing = false;
            })
        }
    }

    @action
    getCheckOutData(orderId = '', gift = false) {
        const storeId = ShopStore.storeInfo && ShopStore.storeInfo.storeId ? ShopStore.storeInfo.storeId : ''
        let params = {
            storeId,
            orderId,
            orderType: gift ? 4 : 1
        }
        NetUtils.get(Api.CHECK_OUT, params).then((result) => {
            runInAction(() => {
                if (result.data) {
                    this.checkOutData = result.data
                }
            })
        }).catch((e) => {
            runInAction(() => {
            })
        })
    }

    @action
    setCheckOutAddress(address) {
        runInAction(() => {
            this.checkOutData.address = address
        })
    }

    @action
    clearCheckOutData() {
        this.checkOutData = null
    }

    @computed get getProductCount() {
        let count = 0;
        try {
            for (const iterator of this.productList) {
                for (const iterator2 of iterator.specialList) {
                    for (const iterator3 of iterator2.commodityList) {
                        count += iterator3.quantity
                    }
                }
            }
        } catch (error) {
        }
        return count
    }
}

export default new ShopCartStore();




