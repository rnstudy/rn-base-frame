import { observable, action, runInAction, useStrict, toJS } from 'mobx';

import NetUtils from '../utils/NetUtils';
import * as Api from '../utils/Api';
import Storage from "../utils/StorageUtils";
import * as Constant from "../utils/Constant"
import * as mobx from "mobx";

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed"});

class MyOrderStore {

    @observable orderListDictionary = {};

    @observable logisticsData = {};

    @action
    getUserOrder(orderStatus, isRefresh = true, callBack) {
        //console.log('2')
        let saveKey = orderStatus;
        if (orderStatus + '' === '') {
            saveKey = 'all'
        }
        let orderLiatData = { items: [] };
        let newPage = 1;

        if (this.orderListDictionary && this.orderListDictionary[saveKey] && !isRefresh) {
            newPage = isRefresh ? 1 : this.orderListDictionary[saveKey].pageIndex || 1;
            orderLiatData = JSON.parse(JSON.stringify(toJS(this.orderListDictionary[saveKey])));
        } else {
            this.orderListDictionary[saveKey] = null;
        }

        let params = {
            orderType: 1,
            orderStatus: orderStatus,
            currentPage: newPage++,
            numsPerPage: 10,
        }
        
        NetUtils.get(Api.GET_USER_ORDER, params, false).then((result) => {
            //console.log('---result',result)
            if (result && result.data && result.data.items && result.data.items.length > 0) {
                if (orderLiatData) {
                    orderLiatData.items = orderLiatData.items.concat(result.data.items)
                } else {
                    orderLiatData = { items: result.data.items };
                }
                runInAction(() => {
                    orderLiatData.pageIndex = newPage;
                    this.orderListDictionary[saveKey] = orderLiatData
                    callBack && callBack(false)
                })
            } else {
                runInAction(() => {
                    callBack && callBack(true)
                })
            }
        }).catch((e) => {
            callBack && callBack(true)
            console.log('=====getListDataeeeeee==', e);
        })
    }

    @action
    getlogisticsevent(orderId, orderCode, orderTrackId,callBack){
        let params ={
            orderId:orderId,
            orderCode:orderCode,
            orderTrackId:orderTrackId,
        }
        NetUtils.get(Api.GET_LOGISTICS_EVENT,params).then((result) => {
            if (result && result.data){
                runInAction(() => {
                    if (this.logisticsData[orderTrackId]){
                        this.logisticsData[orderTrackId].data = result.data;
                    }else{
                        this.logisticsData[orderTrackId] = {};
                        this.logisticsData[orderTrackId].data = result.data;
                    }
                })
            }else {
                runInAction(() => {
                    callBack && callBack(true)
                })
            }
        }).catch((e) => {
            console.log('catch',e);
            runInAction(() => {
                callBack && callBack(true)
            })
            console.log('=====getListDataeeeeee==', e);
        })
    }
}

export default new MyOrderStore();