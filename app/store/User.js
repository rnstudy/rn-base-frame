import { observable, action, runInAction, useStrict, toJS } from 'mobx';
import { Platform, DeviceEventEmitter } from 'react-native'
import NetUtils from "../utils/NetUtils";
import * as Api from "../utils/Api";
import * as mobx from "mobx";
import { observer } from 'mobx-react/native';

// 用户的店主状态
export const SHOPKEEPER_PRACTICE = 'PRACTICE';// 实习店主
export const SHOPKEEPER_REGULAR = 'REGULAR';// 正式店主
export const SHOPKEEPER_INVALID = 'INVALID';// 冻结

// 不允许在动作之外进行状态修改
// mobx.configure({ enforceActions: "observed" });

class UserStore {

    @observable userInfo = {
        username: 'AAA',
    };

    @observable refreshing = false;
    @observable shopkeeperInfo = {
        "userId": '', "sex": 2, "province": "阿尔巴尼亚", "source": 1, "tags": [{ "tagName": "ailsa2", "tagId": 12 },
        { "tagName": "唯品会", "tagId": 4 }, { "tagName": "vip-1", "tagId": 2 },
        { "tagName": "唯品会小妹", "tagId": 1 }],
        "salesmanId": "42k34h3j5353hk",
        "headimgurl": "https://avatars2.githubusercontent.com/u/5243522?s=460&v=4",
        "store": { "storeName": "测试内容gynk", "headImgUrl": "测试内容ru94", "storeId": 43713 },
        "nickname": "", "email": "rahul.wu@vipshop.com",
        "isStoreMan": true, "hasUserTag": true,
        "city": "阿尔巴尼亚", "country": "阿尔巴尼亚"
    };

    @observable commession = {
        unit: '$',
        remainingCommission: '',
    };

    @observable teamInfo = null;


    @observable commissionAndPoint = {
        totalCommission: 0,
        balanceCommission: 0,
        pendingCommission: 0,
        currencyType: '',
        unit: ''
    };

    @observable teamCommission = {
        teamCommission:0,
        memberCount:0,
        inviteAward:0
    };

    @observable commissionStatements = {
        currentPage: "",
        items:[],
        numsPerPage: "",
        unit: "",
    };
    @observable salesDetails = {
        "email":"hellohowardone@gmail.com",
        "headImgUrl":null,
        "nickname":"hellohowardone",
        "saleData":{
            "total":{"orders":10,"amount":103.46,"commission":17.8},
            "month":{"orders":10,"amount":103.46,"commission":17.8,"unit":"$"},
            "day":{"orders":1,"amount":2,"commission":3,"unit":"$"},
            "week":{"orders":5,"amount":87.86,"commission":16.2,"unit":"$"}},
        "currencyType":"USD",
        "unit":"$",
        "status":"REGULAR",
        "remainingPracticeTime":0,
        "regularOrderCount":3
    };
    @observable teamSalesDetail ={
        "items":[
            {"amount":0,"commission":5,"headImgUrl":null,"nickname":"319389624","status":"REGULAR","storeId":10808,"createTime":"2019-03-25 19:08:11"},
            {"amount":0,"commission":5,"headImgUrl":null,"nickname":"1322921103","status":"REGULAR","storeId":10807,"createTime":"2019-03-25 19:01:34"}
        ],
        "unit":"$"
    }



    /**
     * 重置
     */
    @action
    resetData() {
        runInAction(() => {
            this.userInfo = {
                username: 'AAA',
            };
            this.refreshing = false;
            this.shopkeeperInfo = null;
            this.commession = {
                unit: '$',
                remainingCommission: '',
            };
            this.teamInfo = null;
            this.commissionAndPoint = {
                totalCommission: 0,
                balanceCommission: 0,
                pendingCommission: 0,
                currencyType: '',
                unit: ''
            };
        })
    }

    @action
    setUsername(username) {
        this.userInfo.username = username;
    }


    // @action
    // setShopKeeperInfo(info) {
    //     this.shopkeeperInfo=info
    // }

    /**
     * 店主信息
     */
    @action
    getShopkeeperInfo(callBack) {
        this.refreshing = true;
        NetUtils.get(Api.GET_USER_INFO).then((result) => {
            //console.log('getShopkeeperInfo(callBack)',result.data)
            if (result && result.data) {
                runInAction(() => {
                    this.shopkeeperInfo = result.data;
                    this.endRefreshing(callBack);
                })
            }
        }).catch((e) => {
            runInAction(() => {
                // this.refreshing = false;
                this.endRefreshing(callBack);
            })
        })
    }

    /**
     * 所有佣金
     * data: 
       { totalCommission: 1.6,
         balanceCommission: 0,
         pendingCommission: 1.6,
         currencyType: 'USD',
         unit: '$' }
     */
    @action
    getTotalCommission(callBack) {
        NetUtils.get(Api.GET_TOTAL_COMMISSION).then((result) => {
            console.log('||||getTotalCommission',result);
            if (result && result.data) {
                runInAction(() => {
                    this.commissionAndPoint= result.data;
                    callBack && callBack()
                })
            }
        }).catch((e) => {
            runInAction(() => {
                this.endRefreshing();
            })
        })
    }

    /**
     * 所有积分
     */
    @action
    getTotalPoint(callBack) {
        NetUtils.get(Api.GET_TOTAL_POINT).then((result) => {
            if (result && result.data) {
                runInAction(() => {
                    this.commissionAndPoint.totalPoint = result.data.totalPoint;
                    callBack && callBack()
                })
            }
        }).catch((e) => {
            runInAction(() => {
                this.endRefreshing();
            })
        })
    }


    /**
     * 剩余佣金
     */
    @action
    getRemainingCommession(callBack) {
        NetUtils.get(Api.REMAINING_COMMESSION).then((result) => {
            console.log('=REMAINING_COMMESSION=', result);
            if (result && result.data) {
                runInAction(() => {
                    // console.log('==== result.data=====', result.data);
                    this.commession = result.data;
                    callBack && callBack()
                    // this.refreshing = false;
                    this.endRefreshing();
                })
            }
        }).catch((e) => {
            runInAction(() => {
                // this.refreshing = false;
                this.endRefreshing();
            })
        })
    }

    @action
    endRefreshing(callBack) {
        this.refreshing = false;
        callBack && callBack();
    }

    /**
     * 获取团队销售信息
     */
    @action
    getTeamInfo(callBack) {
        NetUtils.get(Api.TEAM_INFO).then((result) => {
            if (result && result.data) {
                runInAction(() => {
                    // console.log('==== result.data=====', result.data);
                    this.teamInfo = result.data;
                    callBack && callBack()
                    // this.refreshing = false;
                    // this.endRefreshing();
                })
            }
        }).catch((e) => {
            runInAction(() => {
                this.endRefreshing();
                callBack && callBack();
            })
        })
    }
    /**
     * 获取好友佣金奖励
     */
    @action
    getTeamCommission( callBack ){
        NetUtils.get(Api.TEAM_COMMISSION).then((result) => {
            console.log('getTeamCommission',result)
            if (result && result.data) {
                runInAction(() => {
                    this.teamCommission = result.data;
                    callBack && callBack()
                })
            }
        }).catch((e) => {
            runInAction(() => {
                this.endRefreshing();
                callBack && callBack();
            })
        })
    }

    // 我的钱包
    @action
    getCommissionStatements(btnIndex, userId, callBack ){
        let newPage = 0;
        let params = {
            type : btnIndex,
            //userId : userId,
            currentPage: newPage++,
            numsPerPage: 10,
        }
        console.log('params',params)
        NetUtils.get(Api.GET_COMMISION_STATEMENTS, params).then((result) => {
            console.log('getCommissionStatements',result);
            if (result && result.data) {
                runInAction(() => {
                    this.commissionStatements = result.data;
                    callBack && callBack()
                })
            }
        }).catch((e) => {
            runInAction(() => {
                this.endRefreshing();
                callBack && callBack();
            })
        })
    }

    //销售明细
    @action
    getSalesDetails(callBack){
        this.refreshing = true;
        NetUtils.get(Api.SHOPKEEPER_INFO).then((result) => {
            //console.log('getShopkeeperInfo(callBack)',result.data)
            if (result && result.data) {
                runInAction(() => {
                    this.salesDetails = result.data;
                    this.endRefreshing(callBack);
                })
            }
        }).catch((e) => {
            runInAction(() => {
                // this.refreshing = false;
                this.endRefreshing(callBack);
            })
        })
    }

    //团队销售列表
    @action
    getTeamSalesDetail(callBack){
        this.refreshing = true;
        NetUtils.get(Api.GET_TEAM_SALES_DETAIL).then((result) => {
            if(result && result.data){
                runInAction(() => {
                     this.teamSalesDetail = result.data;
                     this.endRefreshing(callBack);
                })
            }
        }).catch((e) => {
            runInAction(() => {
                // this.refreshing = false;
                this.endRefreshing(callBack);
            })
        })
    }
}

export default new UserStore();