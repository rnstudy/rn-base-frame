import { observable, action, runInAction, useStrict, toJS } from "mobx";

import NetUtils from "../utils/NetUtils";
import * as Api from "../utils/Api";
import { Actions } from "react-native-router-flux";
import Storage from "../utils/StorageUtils";
import * as Constant from "../utils/Constant";
import * as mobx from "mobx";

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed" });

class ShopStore {
    @observable selectItem = [];
    @observable storeInfo = null;
    @observable isRefreshing = false;
    @observable listCount = 0;
    @observable page = 0;
    @observable isNoMore = false;
    @observable isFrozen = false; // 该店主是否被冻结，false为不冻结

    @observable categoryData = null;

    @observable categoryProductData = {
        dataId: "",
        dataType: "",
        isRefreshing: false,
        page: 0,
        isNoMore: false,
        listData: []
    };

    constructor() {
        Storage.load({
            key: Constant.SHOP_STORE_INFO
        })
            .then(result => {
                this.storeInfo = result;
            })
            .catch(() => { });
    }

    /**
     * 重置
     */
    @action
    resetShop() {
        this.selectItem = [];
        this.storeInfo = null;
        this.isRefreshing = false;
        this.listCount = 0;
        this.page = 0;
        this.isFrozen = true;
        Storage.save({
            key: Constant.SHOP_STORE_INFO,
            data: {}
        });
    }

    //设置店铺信息
    @action
    setShopInfo(storeInfo) {
        this.storeInfo = storeInfo;
        Storage.save({
            key: Constant.SHOP_STORE_INFO,
            data: storeInfo
        });
    }

    /**
     * 获取店铺信息
     */
    @action
    getStoreInfo(callBack) {
        NetUtils.get(Api.STORE_INFO, {}, false)
            .then(result => {
                if (result && result.data) {
                    Storage.save({
                        key: Constant.SHOP_STORE_INFO,
                        data: result.data
                    });

                    let data = result.data;
                    let status;
                    if (JSON.stringify(data) === "{}") {
                        // 非店主
                        status = 1;
                    } else if (data.status === 9) {
                        // 申请中
                        status = 2;
                    } else if (data.status === 0) {
                        // 申请失败
                        status = 4;
                    } else if (data.status === 3) {
                        // 冻结店主
                        status = 5;
                        runInAction(() => {
                            this.isFrozen = true;
                        });
                    } else if (data.code + "" === "10001") {
                        status = 1;
                    } else {
                        status = 3;
                    }

                    switch (status) {
                        case 1: // 申请店主
                            Actions.reset("InviteCode");
                            break;

                        case 2: // 正在审核
                            Actions.reset("ApplyPartner");
                            break;

                        case 4: // 审核失败
                            Actions.reset("ApplyPartner");
                            break;
                        default:
                            break;
                    }
                    runInAction(() => {
                        this.storeInfo = result.data;
                        callBack && callBack();
                    });
                }
            })
            .catch(e => {
                let code = e.code;
                if (code + "" === "10001") {
                    Actions.reset("InviteCode");
                }
            });
    }

    /**
     * 删除店铺商品
     */
    @action
    takeOffSelves(skaIds) {
        let params = {
            skaIds: JSON.stringify(skaIds)
        };
        NetUtils.post(Api.STORE_TAKE_OFF, params)
            .then(result => {
                if (result && result.data) {
                    let newArr = [];
                    let orgArr = JSON.parse(JSON.stringify(this.selectItem));
                    for (const iterator of orgArr) {
                        const { productId } = iterator;
                        if (!this.computeId(productId, skaIds)) {
                            newArr.push(iterator);
                        }
                    }
                    runInAction(() => {
                        this.selectItem = newArr;
                        this.listCount = this.listCount - skaIds.length;
                    });
                }
            })
            .catch(e => {
                console.log("==takeOffSelves==", e);
            });
    }

    computeId(productId, array) {
        for (const id of array) {
            if (id + "" === productId) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取店铺商品列表
     */
    @action
    getSelectedProductList(isRefresh, callBack) {
        if (this.isRefreshing) {
            return;
        }
        this.isRefreshing = true;
        let storeId = this.storeInfo.storeId;
        let newPage = isRefresh ? 1 : ++this.page;
        if (isRefresh) {
            this.isNoMore = false;
        }
        let params = {
            page: newPage,
            pageSize: 20,
            storeId
        };
        NetUtils.get(Api.SELECTED_PRODUCT, params)
            .then(result => {
                if (
                    result &&
                    result.data &&
                    result.data.items &&
                    result.data.items.length > 0
                ) {
                    runInAction(() => {
                        let tempItems = result.data.items;
                        tempItems.map((item, index) => {
                            item.showMaxHeight = false;
                            if (
                                item.logisticsType &&
                                item.logisticsType + "" === "express"
                            ) {
                                item.showMaxHeight = true;
                            } else if (
                                index % 2 === 0 &&
                                index + 1 < tempItems.length
                            ) {
                                nextItem = tempItems[index + 1];
                                if (
                                    nextItem.logisticsType &&
                                    nextItem.logisticsType + "" === "express"
                                ) {
                                    item.showMaxHeight = true;
                                }
                            } else if (index % 2 === 1) {
                                preItem = tempItems[index - 1];
                                if (
                                    preItem.logisticsType &&
                                    preItem.logisticsType + "" === "express"
                                ) {
                                    item.showMaxHeight = true;
                                }
                            }
                        });

                        this.selectItem = isRefresh
                            ? tempItems
                            : this.selectItem.concat(tempItems);
                        this.listCount = result.data.count;
                        this.isRefreshing = false;
                        this.page = newPage;
                        callBack && callBack();
                    });
                } else if (isRefresh && result.data.items.length + "" === "0") {
                    runInAction(() => {
                        this.listCount = result.data.count;
                        this.selectItem = [];
                        this.isRefreshing = false;
                        this.isNoMore = true;
                        callBack && callBack();
                    });
                } else {
                    runInAction(() => {
                        this.isRefreshing = false;
                        this.isNoMore = true;
                        callBack && callBack();
                    });
                }
            })
            .catch(e => {
                this.isRefreshing = false;
                console.log("==getStoreInfoeeee==", e);
            });
    }

    /**
     * 店铺管理删除商品
     */
    @action
    deleteGoods(skaIds, callBack) {
        let params = {
            skaIds: JSON.stringify(skaIds)
        };
        NetUtils.post(Api.STORE_TAKE_OFF, params)
            .then(result => {
                if (result && result.data) {
                    runInAction(() => {
                        callBack && callBack(true);
                    });
                }
            })
            .catch(e => {
                console.log("==takeOffSelves==", e);
                callBack && callBack(false);
            });
    }

    /**
     * 查询商品分类
     * categoryId: 分类ID，非必填，不填表示查所有一级分类
     * categoryType: 分类类型（1,2,3），非必填
     */
    @action
    categoryList(
        categoryObj = null,
        index = 0,
        callBack = null,
        selectCategoryArr = []
    ) {
        let params = {};
        let requestLevel1 = true; // 请求一级分类
        if (categoryObj) {
            const {
                categoryId,
                categoryType //第几层，12
            } = categoryObj;
            params.categoryId = categoryId;
            params.categoryType = categoryType;
            requestLevel1 = false;
        }
        NetUtils.get(Api.STORE_CATEGORY, params)
            .then(result => {
                if (result && result.data) {
                    runInAction(() => {
                        if (requestLevel1) {
                            this.categoryData = result.data.items;
                        } else {
                            const {
                                categoryType //第几层，12
                            } = categoryObj;
                            if (categoryType + "" === "1") {
                                this.categoryData[
                                    selectCategoryArr[0].index
                                ].items = result.data.items;
                            } else {
                                this.categoryData[
                                    selectCategoryArr[0].index
                                ].items[selectCategoryArr[1].index].items =
                                    result.data.items;
                            }

                            // for (const key in toJS(this.categoryData)) {
                            //     if (this.categoryData[key].categoryId === categoryObj.categoryId) {
                            //         this.categoryData[key].items = result.data.items
                            //     }
                            // }
                        }
                        callBack && callBack();
                    });
                } else {
                    callBack && callBack();
                }
            })
            .catch(e => {
                // console.log('==takeOffSelves==', e);
                callBack && callBack();
            });
    }

    /**
     * 根据分类查询商品
     */
    @action
    categoryProduct(callBack, categoryId, categoryType, isRefresh) {
        let {
            dataId,
            dataType,
            isRefreshing,
            page,
            isNoMore,
            listData
        } = this.categoryProductData;
        if (isRefreshing) {
            return;
        }
        isRefreshing = true;

        let newPage = isRefresh ? 1 : ++page;
        if (isRefresh) {
            isNoMore = false;
            if (dataId !== categoryId || dataType !== categoryType) {
                this.categoryProductData["dataId"] = categoryId;
                this.categoryProductData["dataType"] = categoryType;
                this.categoryProductData["listData"] = [];
            }
        }

        let params = {
            currentPage: newPage,
            numsPerPage: 20
        };
        if (categoryId && categoryType) {
            params = {
                currentPage: newPage,
                numsPerPage: 20,
                categoryId,
                categoryType
            };
        }

        NetUtils.get(Api.STORE_CATEGORY_PRODUCT, params)
            .then(result => {
                if (
                    result &&
                    result.data &&
                    result.data.items &&
                    result.data.items.length > 0
                ) {
                    runInAction(() => {
                        let tempItems = result.data.items;
                        listData = isRefresh
                            ? tempItems
                            : this.categoryProductData.listData.concat(
                                tempItems
                            );
                        isRefreshing = false;
                        page = newPage;
                        this.categoryProductData = {
                            isRefreshing,
                            page,
                            isNoMore,
                            listData
                        };
                        callBack && callBack(listData);
                    });
                } else {
                    runInAction(() => {
                        isRefreshing = false;
                        isNoMore = true;
                        callBack && callBack(this.categoryProductData.listData);
                    });
                }
            })
            .catch(e => {
                isRefreshing = false;
                callBack && callBack(this.categoryProductData.listData);
            });
    }
}

export default new ShopStore();
