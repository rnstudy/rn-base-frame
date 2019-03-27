import {action, observable, runInAction, toJS, useStrict} from 'mobx';

import NetUtils from '../utils/NetUtils';
import * as Api from '../utils/Api';
import ShopStore from "./ShopStore";
import * as mobx from "mobx";

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed"});

class CollectionStore {

    @observable listData = []; //列表数据
    @observable collectionDetail = null; //专场详情
    @observable isRefreshing = false;

    /**
     * 查询专场
     * @param callBack
     */
    @action
    queryCollections(callBack) {
        this.isRefreshing = true;

        const {storeId} = ShopStore.storeInfo;

        let params = {
            storeId: storeId,
            userId: 583
        };

        NetUtils.get(Api.STORE_QUERY_COLLECTION, params).then((result) => {
            if (result && result.data && result.data.items) {
                const {data} = result;

                runInAction(() => {
                    this.listData = data.items;
                    this.endFresh(callBack);
                })
            } else {
                runInAction(() => {
                    this.listData = [];
                    this.endFresh(callBack);
                })
            }
        }).catch((e) => {
            console.log('queryCollections失败', e);
            runInAction(() => {
                this.endFresh(callBack);
            })
        })
    }

    endFresh(callBack) {
        this.isRefreshing = false;
        callBack && callBack()
    }

    /**
     * 专场详情查询
     * @param callBack
     */
    @action
    getCollectionDetails(collectionId, callBack) {
        const {storeId} = ShopStore.storeInfo;

        let params = {
            storeId: storeId,
            collectionId: collectionId,
        };

        NetUtils.get(Api.STORE_COLLECTION_DETAIL, params).then((result) => {
            if (result && result.data && result.data.items) {
                const {data} = result;
                runInAction(() => {
                    this.collectionDetail = data;
                    callBack && callBack()
                })
            } else {
                runInAction(() => {
                    this.collectionDetail = null;
                    callBack && callBack()
                })
            }
        }).catch((e) => {
            console.log('queryCollections失败', e);
            runInAction(() => {
                callBack && callBack();
            })
        })
    }

    /**
     * 专场排序
     * @param collections    array<number>
     * @param callBack
     */
    @action
    postCollectionSort(collections, callBack) {
        const {storeId} = ShopStore.storeInfo;

        let params = {
            storeId: storeId,
            collections: JSON.stringify(collections),
        };

        NetUtils.post(Api.STORE_COLLECTION_SORT, params).then((result) => {
            runInAction(() => {
                callBack && callBack(result)
            })
        }).catch((e) => {
            console.log('postCollectionSort', e);
            runInAction(() => {
                callBack && callBack();
            })
        })
    }

    /**
     * 专场删除
     * @param collections    array<number>
     * @param callBack
     */
    @action
    postCollectionDel(collections, callBack) {
        const {storeId} = ShopStore.storeInfo;

        let params = {
            storeId: storeId,
            collections: JSON.stringify(collections),
        };

        NetUtils.post(Api.STORE_COLLECTION_DEL, params).then((result) => {
            runInAction(() => {
                callBack && callBack(result)
            })
        }).catch((e) => {
            console.log('postCollectionSort', e);
            runInAction(() => {
                callBack && callBack();
            })
        })
    }

    /**
     * 新建/编辑专场
     * collectionId    专场id    number
     * collectionName    专场名    string
     * languageType        string
     * productPic    专场图    string
     * skaIds    专场商品列表    array<number>
     * storeId        number
     * userId
     */
    @action
    postCollectionEdit(collectionInfo, callBack) {
        const {storeId} = ShopStore.storeInfo;

        let params = {
            storeId: storeId,
            collectionId: collectionInfo.collectionId ? collectionInfo.collectionId : '',
            collectionName: collectionInfo.collectionName,
            productPic: collectionInfo.productPic,
            skaIds: JSON.stringify(collectionInfo.skaIds),
        };

        NetUtils.post(Api.STORE_COLLECTION_EDIT, params).then((result) => {
            runInAction(() => {
                callBack && callBack(result)
            })
        }).catch((e) => {
            console.log('postCollectionSort', e);
            runInAction(() => {
                callBack && callBack();
            })
        })
    }
}

export default new CollectionStore();