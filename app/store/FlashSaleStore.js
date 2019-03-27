import { observable, action, runInAction, useStrict, toJS } from 'mobx';

import NetUtils from '../utils/NetUtils';
import * as Api from '../utils/Api';
import Storage from "../utils/StorageUtils";
import * as Constant from "../utils/Constant"
import moment from 'moment';
export const END_STATE = '1';
export const ON_SALE_STATE = '2';
export const COMING_STATE = '3';
import * as mobx from "mobx";

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed"});

class FlashSaleStore {

    @observable flashSaleList = null;
    @observable currentTime = null;

    constructor() {
    }


    @action
    clearData() {
        this.flashSaleList = null;
        this.currentTime = null;
    }

    /**
     * 秒杀专场列表
     */
    @action
    getFlashSaleList(callBack) {
        NetUtils.get(Api.FLASH_SALE_LIST).then((result) => {
            if (result.data && result.data.items && result.data.items.length > 0) {
                runInAction((() => {
                    let pageIndex = null;
                    let tempList = result.data.items;
                    const currentTime = result.data.currentTime;
                    tempList.map((item, i) => {
                        const { startTime, endTime } = item;
                        if (currentTime > endTime) {
                            item.state = END_STATE
                        } else if (currentTime >= startTime && currentTime < endTime) {

                            item.state = ON_SALE_STATE
                            pageIndex = i;
                        } else {
                            item.state = COMING_STATE;
                            if (pageIndex == null) {
                                pageIndex = i
                            }
                        }
                        item.list = null;
                        item.isLoading = false;
                    })
                    if (pageIndex == null) {
                        pageIndex = 0
                    }
                    callBack && callBack(pageIndex)
                    this.flashSaleList = tempList;
                }))
            }
        }).catch(() => {
        })
    }

    /**
     * 获取首页商品列表
     * @param {*} pageIndex 
     * @param {*} isRefresh 是否刷新
     */
    @action
    getListData(pageIndex) {
        if (this.flashSaleList[pageIndex].isLoading) {
            return
        }
        this.flashSaleList[pageIndex].isLoading = true
        const flashSaleItem = JSON.parse(JSON.stringify(toJS(this.flashSaleList[pageIndex])));
        const { flashSaleId } = flashSaleItem;
        NetUtils.get(Api.FLASH_SALE_INFO, { flashSaleId }).then((result) => {
            if (result && result.data) {
                runInAction((() => {
                    this.flashSaleList[pageIndex].list = result.data.items;
                    const { startTime, endTime, currentTime } = result.data;
                    if (startTime && endTime && currentTime) {
                        if (currentTime > endTime) {
                            this.flashSaleList[pageIndex].state = END_STATE;
                            this.flashSaleList[pageIndex].countTime = null;
                        } else if (currentTime >= startTime && currentTime < endTime) {
                            this.flashSaleList[pageIndex].state = ON_SALE_STATE
                            this.flashSaleList[pageIndex].countTime = endTime - currentTime
                        } else {
                            this.flashSaleList[pageIndex].state = COMING_STATE;
                            this.flashSaleList[pageIndex].countTime = startTime - currentTime
                        }
                    }
                    this.flashSaleList[pageIndex].isLoading = false
                }))
            } else {
                this.flashSaleList[pageIndex].isLoading = false
            }
        }).catch((e) => {
            this.flashSaleList[pageIndex].isLoading = false
        })
    }


}

export default new FlashSaleStore();
