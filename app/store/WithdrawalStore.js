import { observable, action, runInAction, useStrict, toJS } from 'mobx';

import NetUtils from '../utils/NetUtils';
import * as Api from '../utils/Api';
import moment from '../../node_modules/moment'
import I18n from '../config/i18n';
import AppSetting from './AppSetting';
import * as mobx from "mobx";

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed"});

class WithdrawalStore {
    @observable withdrawHistoryData = {
        listData: [], //提现列表
        unit: '',
        currentPage: 1,
        isRefreshing: false,
        noMore: false,
        count:'',
        numsPerPage: "",
        sum: "",
    };
    

    @action
    getWithdrawHistory(isRefresh = false, callBack) {
        let withdrawHistory = toJS(this.withdrawHistoryData);
        withdrawHistory.isRefreshing = true;
        // let newPage = 1;
        // let tempData = null;
        let newPage = isRefresh ? 1 : withdrawHistory.currentPage;
        let tempData = isRefresh ? [] : JSON.parse(JSON.stringify(toJS(withdrawHistory.listData)));

        let params = {
            numsPerPage: 15,
            currentPage: newPage++
        }

        NetUtils.get(Api.WITHDRAW_HISTORY, params).then((result) => {
            if (result && result.data && result.data.items) {
                if (result.data.items.length > 0) {
                    if (tempData) {
                        tempData = tempData.concat(result.data.items)
                    } else {
                        tempData = result.data.items;
                    }

                    runInAction(() => {
                        let yearTitle = '';
                        for (let index = 0; index < tempData.length; index++) {
                            let element = tempData[index];
                            const lngCode = AppSetting.getCurrentLanguage.code;
                            let localMoment = moment;
                            if (lngCode === 'zh_cn') {
                                // console.log('中文 中文 中文 中文 中文')
                                // localMoment.locale('zh-cn');
                                element.month = localMoment(element.settleTime).format("M");
                                element.day = localMoment(element.settleTime).format("D");
                                element.monthDay = element.month + '月' + element.day + '日提现';

                            } else {
                                // console.log('英文 英文 英文 英文 英文')
                                // localMoment.locale('en');
                                element.monthDay = localMoment(element.settleTime).format("Do MMM");//element.day + ' ' + element.month;
                            }
                            let year = localMoment(element.settleTime).format('YYYY');
                            if (yearTitle !== year) {
                                yearTitle = year;
                                element.year = yearTitle;
                            } else {
                                element.year = '';
                            }
                            element.startDate = localMoment(element.cycleStartTime).format('YYYY/MM/DD');
                            element.endDate = localMoment(element.cycleEndTime).format('YYYY/MM/DD');
                        }
                        withdrawHistory.sum = result.data.sum;
                        withdrawHistory.unit = result.data.unit;
                        withdrawHistory.listData = tempData;
                        withdrawHistory.isRefreshing = false;
                        withdrawHistory.currentPage = newPage;
                        withdrawHistory.noMore = false;
                        // console.log('withdrawHistory:', withdrawHistory);
                        this.withdrawHistoryData = withdrawHistory;
                        callBack && callBack()
                    })
                } else {
                    runInAction(() => {
                        withdrawHistory.isRefreshing = false;
                        withdrawHistory.noMore = true;
                        this.withdrawHistoryData = withdrawHistory;
                        callBack && callBack()
                    })
                }
            }
        }).catch((e) => {
            console.log('获取提现历史失败', e);
            withdrawHistory.isRefreshing = false;
            this.withdrawHistoryData = withdrawHistory;
            callBack && callBack();
        })
    }

    @observable withdrawDetailData = {
        // saleSettlement: {},
        // unit: '',
        // listData: [], //提现详情列表
        // currentPage: 1,
        // isRefreshing: false,
        // noMore: false,
    };

    @action
    getWithdrawDetail(isRefresh = false, callBack, saleSettlementId) {
        let withdrawDetail = toJS(this.withdrawDetailData[saleSettlementId]);
        if (!withdrawDetail) {
            withdrawDetail = {
                saleSettlement: {},
                unit: '',
                listData: [], //提现详情列表
                currentPage: 1,
                isRefreshing: false,
                noMore: false,
            };
        }
        withdrawDetail.isRefreshing = true;
        let newPage = isRefresh ? 1 : withdrawDetail.currentPage;
        let tempData = isRefresh ? [] : JSON.parse(JSON.stringify(toJS(withdrawDetail.listData)));

        let params = {
            numsPerPage: 15,
            currentPage: newPage++,
            saleSettlementId: saleSettlementId,
        }

        NetUtils.get(Api.WITHDRAW_DETAIL, params).then((result) => {
            let items = result.data.details.items;
            if (result && result.data && items) {
                if (items.length > 0) {
                    if (tempData) {
                        tempData = tempData.concat(items)
                    } else {
                        tempData = items;
                    }

                    runInAction(() => {
                        let saleSettlement = result.data.saleSettlement;
                        saleSettlement.settleTime = moment(saleSettlement.settleTime).format('YYYY/MM/DD');
                        saleSettlement.cycleStartTime = moment(saleSettlement.cycleStartTime).format('YYYY/MM/DD');
                        saleSettlement.cycleEndTime = moment(saleSettlement.cycleEndTime).format('YYYY/MM/DD');
                        withdrawDetail.saleSettlement = saleSettlement;

                        for (let index = 0; index < result.data.details.items.length; index++) {
                            let element = result.data.details.items[index];
                            element.payTime = moment(element.payTime).format('MM/DD');
                            result.data.details.items[index] = element;
                        }

                        withdrawDetail.unit = result.data.unit;
                        withdrawDetail.listData = tempData;
                        withdrawDetail.isRefreshing = false;
                        withdrawDetail.currentPage = newPage;
                        withdrawDetail.noMore = false;
                        this.withdrawDetailData[saleSettlementId] = withdrawDetail;
                        callBack && callBack()
                    })
                } else {
                    runInAction(() => {
                        withdrawDetail.isRefreshing = false;
                        withdrawDetail.noMore = true;
                        this.withdrawDetailData[saleSettlementId] = withdrawDetail;
                        callBack && callBack()
                    })
                }
            }
        }).catch((e) => {
            console.log('获取提现详情失败', e);
            withdrawDetail.isRefreshing = false;
            this.withdrawDetailData[saleSettlementId] = withdrawDetail;
            callBack && callBack();
        })
    }
}

export default new WithdrawalStore();