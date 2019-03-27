import {action, observable, runInAction, useStrict} from 'mobx';

import NetUtils from '../utils/NetUtils';
import * as Api from '../utils/Api';
import * as mobx from "mobx";

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed"});
class AddressListStore {

    @observable listData = []; //列表数据
    @observable defaultId = "";
    @observable isRefreshing = false;

    /**
     * 获取地址列表数据
     * @param isRefresh
     * @param callBack
     */
    @action
    getListData(isRefresh = false, callBack) {
        this.isRefreshing = true;

        NetUtils.get(Api.ADDRESS_LIST).then((result) => {
            if (result && result.data && result.data.items) {
                if (result.data.items) {
                    const { data } = result;
                    runInAction(() => {
                        this.listData = data.items;
                        this.defaultId = data.default;
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
            console.log('获取地址列表失败', e);
            this.isRefreshing = false;
            callBack && callBack();
        })
    }
    clearData(){
        runInAction(() => {
            this.listData =[];
        })
        
    }
}

export default new AddressListStore();