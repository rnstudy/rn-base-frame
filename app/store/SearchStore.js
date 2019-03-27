import { observable, action, runInAction, useStrict, toJS } from 'mobx';

import NetUtils from '../utils/NetUtils';
import * as Api from '../utils/Api';
import { Actions } from 'react-native-router-flux';
import Storage from "../utils/StorageUtils";
import * as Constant from "../utils/Constant"
import * as mobx from "mobx";

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed"});

class SearchStore {

    @observable productListData = [];
    @observable isRefreshing = false;
    @observable currentPage = 0;
    @observable isNoMore = false;

    @observable needSearchTextInput = false;
    @observable needSearchKeyword = false;
    @observable searchTextInputValue = '';// 搜索页输入框的值
    @observable searchBorderValue = '';// 商品列表页搜索框的值

    @action
    setNeedSearchTextInput(value = false) {
        this.needSearchTextInput = value;
    }

    @action
    setNeedSearchKeyword(value = false) {
        this.needSearchKeyword = value;
    }

    @action
    setSearchTextInputValue(value) {
        this.searchTextInputValue = value;
    }

    @action
    setSearchBorderValue(value) {
        this.searchBorderValue = value;
    }

    /**
     * 搜索关键词
     */
    @action
    searchTips(keyword, callback) {
        if (keyword && keyword.length > 0) {
            let params = {
                keyWord: keyword,
            }

            NetUtils.get(Api.SEARCH_TIPS, params).then((result) => {
                runInAction(() => {
                    let resultList = [];
                    if (result && result.data && result.data.tips && result.data.tips.length > 0) {
                        resultList = result.data.tips;
                    }
                    callback && callback(resultList)
                })

            }).catch((error) => {
                console.log('==searchTips==', error);
            })
        }
    }

    /**
     * 按关键词提示搜索商品
     */
    @action
    searchProductList(isRefresh, keyword, callback) {
        if (keyword && keyword.length) {
            if (this.isRefreshing) {
                return;
            }
            this.isRefreshing = true;

            let newPage = isRefresh ? 1 : ++this.currentPage;
            if (isRefresh) {
                this.isNoMore = false;
            }

            let params = {
                keyWord: keyword,
                currentPage: newPage,
                numsPerPage: 20,
            }

            NetUtils.get(Api.SEARCH_PRODUCT_LIST, params).then((result) => {
                if (result && result.data && result.data.items && result.data.items.length > 0) {
                    runInAction(() => {
                        let tempItems = result.data.items;
                        // console.log('请求到的数量是：', tempItems.length)
                        let listData = isRefresh ? tempItems : this.productListData.concat(tempItems)
                        this.isRefreshing = false;
                        this.currentPage = newPage;
                        this.isNoMore = false;
                        this.productListData = listData;
                        callback && callback(this.productListData);
                    })
                } else {
                    runInAction(() => {
                        this.isRefreshing = false;
                        this.isNoMore = true;
                        callback && callback(this.productListData);
                    })
                }
            }).catch((e) => {
                this.isRefreshing = false;
                callback && callback();
            })
        }
    }
}

export default new SearchStore();