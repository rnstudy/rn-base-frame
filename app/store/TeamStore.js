import { observable, action, runInAction, useStrict, toJS } from 'mobx';
import { Platform, DeviceEventEmitter } from 'react-native'
import NetUtils from "../utils/NetUtils";
import * as Api from "../utils/Api";
import * as mobx from "mobx";

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed"});

class TeamStore {

    @observable refreshing = false;
    @observable teamActivityStart = 0;
    @observable teamActivityInfo = null;
    @observable teamMemberList = null;
    @observable teamActivityList = null;
    @observable teamActivitySalesList = null;

    /**
     * 重置
     */
    @action
    resetData() {
        runInAction(() => {
            this.refreshing = false;
            this.teamActivityStart = 0;
            this.teamActivityInfo = null;
            this.teamMemberList = null;
            this.teamActivityList = null;
            this.teamActivitySalesList = null;
        })
    }

    /**
     * 团队活动是否开始
     */
    @action
    getTeamActivityStart(callBack) {
        this.refreshing = true;
        NetUtils.get(Api.TEAM_ACTIVITY_START).then((result) => {
            if (result && result.data) {
                runInAction(() => {
                    this.teamActivityStart = result.data;
                    this.endRefreshing(callBack);
                })
            }
        }).catch((e) => {
            runInAction(() => {
                this.endRefreshing(callBack);
            })
        })
    }

    /**
     * 我的团队活动信息
     */
    @action
    getTeamActivityInfo(callBack) {
        this.refreshing = true;
        NetUtils.get(Api.TEAM_ACTIVITY_INFO).then((result) => {
            if (result && result.data) {
                runInAction(() => {
                    this.teamActivityInfo = result.data;
                    this.endRefreshing(callBack);
                })
            }
        }).catch((e) => {
            runInAction(() => {
                this.endRefreshing(callBack);
            })
        })
    }

    @action
    resetTeamActivityInfo() {
        runInAction(() => {
            this.teamActivityInfo = null;
        })
    }

    @action
    endRefreshing(callBack) {
        this.refreshing = false;
        callBack && callBack();
    }

    /**
     * 我的团队成员
     */
    @action
    getTeamMemberList(callBack) {
        this.refreshing = true;
        NetUtils.get(Api.TEAM_MEMBER_LIST).then((result) => {
            if (result && result.data) {
                runInAction(() => {
                    this.teamMemberList = result.data;
                    this.endRefreshing(callBack);
                })
            }
        }).catch((e) => {
            runInAction(() => {
                this.endRefreshing(callBack);
            })
        })
    }

    /**
     * 团队活动列表
     */
    @action
    getTeamActivityList(callBack) {
        this.refreshing = true;
        NetUtils.get(Api.TEAM_ACTIVITY_LIST).then((result) => {
            if (result && result.data) {
                runInAction(() => {
                    this.teamActivityList = result.data;
                    this.endRefreshing(callBack);
                })
            }
        }).catch((e) => {
            runInAction(() => {
                this.endRefreshing(callBack);
            })
        })
    }

    /**
     * 团队活动销售明细
     */
    @action
    getTeamActivitySales(activityId, callBack) {
        this.refreshing = true;
        let param = {}
        if (typeof (activityId) !== 'undefined') {
            param = { activityId: activityId };
        }

        NetUtils.get(Api.TEAM_ACTIVITY_SALES, param).then((result) => {
            if (result && result.data) {
                runInAction(() => {
                    this.teamActivitySalesList = result.data;
                    this.endRefreshing(callBack);
                })
            }
        }).catch((e) => {
            runInAction(() => {
                this.endRefreshing(callBack);
            })
        })
    }
}

export default new TeamStore();