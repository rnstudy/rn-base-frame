import { observable, action, runInAction, useStrict, toJS } from 'mobx';

import NetUtils from '../utils/NetUtils';
import * as Api from '../utils/Api';
import * as mobx from "mobx";

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed"});

class SalesListStore {

    @observable listData = []; //订单列表数据
    @observable currentPage = 0; //本地页面
    @observable isRefreshing = false;
    @observable noMore = false;

    /**
     * 重置
     */
    @action
    resetData() {
        runInAction(() => {
            this.listData = [];
            this.currentPage = 0;
            this.isRefreshing = false;
            this.noMore = false;
        })
    }

    /**
     * 获取订单列表数据
     * @param isRefresh
     * @param callBack
     */
    @action
    getListData(isRefresh = false, callBack) {
        this.isRefreshing = true;
        let newPage = 1;
        let tempData = null;
        newPage = isRefresh ? 1 : this.currentPage || 1;
        tempData = isRefresh ? [] : JSON.parse(JSON.stringify(toJS(this.listData)));

        let params = {
            numsPerPage: 10,
            currentPage: newPage++
        }

        NetUtils.get(Api.STORE_ORDER_LIST, params).then((result) => {
            if (result && result.data && result.data.items) {
                if (result.data.items.length > 0) {
                    if (tempData) {
                        tempData = tempData.concat(result.data.items)
                    } else {
                        tempData = result.data;
                    }
                    runInAction(() => {
                        this.listData = tempData;
                        this.isRefreshing = false;
                        this.currentPage = newPage;
                        this.noMore = false;
                        callBack && callBack()
                    })
                } else {
                    runInAction(() => {
                        this.isRefreshing = false;
                        this.noMore = true;
                        callBack && callBack()
                    })
                }
            }
        }).catch((e) => {
            console.log('获取订单列表失败', e);
            this.isRefreshing = false;
            callBack && callBack();
        })
    }
}

export default new SalesListStore();