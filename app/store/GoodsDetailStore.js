import { observable, action, runInAction } from "mobx";
import NetUtils from "../utils/NetUtils";
import * as Api from "../utils/Api";
import Storage from "../utils/StorageUtils";
import * as Constant from "../utils/Constant";
import ShopStore from "./ShopStore";
import { Actions } from "react-native-router-flux";
class GoodsDetailStore {
    @observable goodsDetail = {};

    constructor() { }

    @action
    addToCart(params, callBack, failFun) {
        const storeId = ShopStore.storeInfo && ShopStore.storeInfo.storeId ? ShopStore.storeInfo.storeId : ''
        params.storeId = storeId;
        NetUtils.post(Api.ADD_TO_CART, params)
            .then(result => {
                runInAction(() => {
                    callBack && callBack();
                });
            })
            .catch(e => {
                failFun && failFun(e);
                console.log("====addStore=eee=", e);
            });
    }

    @action
    getGoodsDetail(productId, callBack) {
        const storeId = ShopStore.storeInfo && ShopStore.storeInfo.storeId ? ShopStore.storeInfo.storeId : ''
        let params = {
            sku: productId,
            storeId
        };
        NetUtils.get(Api.PRODUCT_DETAIL, params)
            .then(result => {
                if (result.data) {
                    runInAction(() => {
                        if (this.goodsDetail[productId]) {
                            this.goodsDetail[productId].data = result.data;
                        } else {
                            this.goodsDetail[productId] = {};
                            this.goodsDetail[productId].data = result.data;
                        }
                        callBack && callBack();
                    });
                }
            })
            .catch(e => {
                Actions.pop();
            });
    }

    @action
    getGoodsImgDetail(productId, callBack) {
        let params = {
            productId
        };
        NetUtils.get(Api.IMG_DETAIL, params, false)
            .then(result => {
                runInAction(() => {
                    if (this.goodsDetail[productId]) {
                        this.goodsDetail[productId].imgArr = result.data;
                    } else {
                        this.goodsDetail[productId] = {};
                        this.goodsDetail[productId].imgArr = result.data;
                    }
                    callBack && callBack();
                });
            })
            .catch(e => {
                console.log("=======getGoodsImgDetail====", e);
            });
    }

    @action
    getSizeChart(productId, callBack) {
        let params = {
            productId
        };
        NetUtils.get(Api.PROD_SIZE_CHART, params, true, "EN")
            .then(result => {
                runInAction(() => {
                    if (this.goodsDetail[productId]) {
                        this.goodsDetail[productId].sizeChart = result.data;
                    } else {
                        this.goodsDetail[productId] = {};
                        this.goodsDetail[productId].sizeChart = result.data;
                    }
                    callBack && callBack();
                });
            })
            .catch(e => {
                console.log("=======getSizeChart====", e);
            });
    }
}

export default new GoodsDetailStore();
