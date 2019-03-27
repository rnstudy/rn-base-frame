import {action, observable, runInAction, useStrict} from 'mobx';

import NetUtils from '../utils/NetUtils';
import * as Api from '../utils/Api';
import * as mobx from "mobx";

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed"});

class StateListStore {

    @observable listData = []; //列表数据
    @observable cityListData = []; //列表数据
    @observable isRefreshing = false;

    /**
     * 获取州列表
     * @param isRefresh
     * @param callBack
     */
    @action
    getStateListData(countryCode, callBack) {
        this.isRefreshing = true;

        this.listData = [];

        let params = {
            countryCode: countryCode,
        };

        NetUtils.get(Api.STATE_LIST, params).then((result) => {
            if (result && result.data && result.data.items) {
                if (result.data.items.length > 0) {
                    const { data } = result;
                    runInAction(() => {
                        this.listData = data.items;
                        this.isRefreshing = false;
                        callBack && callBack()
                    })
                } else {
                    runInAction(() => {
                        this.isRefreshing = false;
                        callBack && callBack()
                    })
                }
            }
        }).catch((e) => {
            console.log('获取州列表', e);
            this.isRefreshing = false;
            callBack && callBack();
        })
    }

    @action
    getCityListData(stateCode, callBack) {
        this.isRefreshing = true;

        this.cityListData = [];

        let params = {
            stateCode: stateCode,
        };

        NetUtils.get(Api.CITY_LIST, params).then((result) => {
            if (result && result.data && result.data.items) {
                if (result.data.items.length > 0) {
                    const { data } = result;
                    runInAction(() => {
                        this.cityListData = data.items;
                        this.isRefreshing = false;
                        callBack && callBack()
                    })
                } else {
                    runInAction(() => {
                        this.isRefreshing = false;
                        callBack && callBack()
                    })
                }
            }
        }).catch((e) => {
            console.log('获取州列表', e);
            this.isRefreshing = false;
            callBack && callBack();
        })
    }
}

export default new StateListStore();