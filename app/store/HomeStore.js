import { action, observable, runInAction, toJS, useStrict } from 'mobx';

import {
    DeviceEventEmitter,
} from "react-native";
import NetUtils from '../utils/NetUtils';
import * as Api from '../utils/Api';
import Storage from "../utils/StorageUtils";
import * as Constant from "../utils/Constant"
import ShopStore from "./ShopStore";
import * as mobx from "mobx";
import moment from 'moment';

// 不允许在动作之外进行状态修改
mobx.configure({ enforceActions: "observed" });

class HomeStore {

    @observable flashSpecialData = null;
    @observable singleSpecialData = null;
    @observable specialIndex = 0;
    @observable specialList = {};
    @observable specialListId = null;
    @observable unit = '$';



    @observable categoriesList = null;
    @observable bannerData = [];
    @observable listData = {};
    @observable productListData = {};
    @observable flashSaleData = null;
    @observable highBonusData = null;
    @observable dailyNewData = null;
    @observable homeRecommendData = null;
    @observable collectionTitles = {};

    constructor() {
        // Storage.load({
        //     key: Constant.HOME_LIST_DATA,
        // }).then((result) => {
        //     this.listData = result
        // }).catch(() => {
        // })

        // Storage.load({
        //     key: Constant.HOME_HIGH_BONUS,
        // }).then((result) => {
        //     this.highBonusData = result
        // }).catch(() => {
        // })
        // Storage.load({
        //     key: Constant.HOME_DAILY_NEW,
        // }).then((result) => {
        //     this.dailyNewData = result
        // }).catch(() => {
        // })
    }

    /**
     * 重置
     */
    @action
    resetHome() {
        runInAction(() => {
            this.categoriesList = null;
            this.listData = {};
        })
    }

    /**
     * 重置
     */
    @action
    resetProductListData() {
        runInAction(() => {
            this.productListData = {};
        })
    }

    /**
     * banner
     */
    @action
    getBannerData() {
        NetUtils.get(Api.HOME_BANNER_DATA).then((result) => {
            if (result && result.data && result.data && result.data.items.length > 0) {
                runInAction(() => {
                    this.bannerData = result.data.items
                })
            }
        }).catch((e) => {

        })
    }

    /**
     * 超值专场
     */
    @action
    getFlashSpecial() {
        NetUtils.get(Api.HOME_FLASH_SPECIAL).then((result) => {
            if (result && result.data && result.data && result.data.items.length > 0) {
                runInAction(() => {
                    let dataArr = [];
                    for (const iterator of result.data.items) {
                        const { spTitleCn } = iterator;
                        if (spTitleCn.indexOf('秘密专场') < 0) {
                            dataArr.push(iterator)
                        }
                    }
                    this.flashSpecialData = dataArr
                })
            }
        }).catch((e) => {
        })
    }


    /**
     * 每日精选
     */
    @action
    getSingleSpecial(callBack) {
        NetUtils.get(Api.HOME_SINGLE_SPECIAL).then((result) => {
            if (result && result.data && result.data && result.data.items.length > 0) {
                runInAction(() => {
                    this.setSpecialData(result.data.items, callBack)
                })
            }
        }).catch((e) => {
        })
    }

    setSpecialData(items, callBack) {
        let tempIndex = 0;
        items.map((iterator, index) => {
            const { spStartTime, spCurrentTime } = iterator;
            const star = moment(spStartTime);
            const current = moment(spCurrentTime);
            if (current >= star) {
                iterator.isSelling = true;
                tempIndex = index
            } else {
                iterator.isSelling = false;
            }
        })
        this.specialIndex = tempIndex;
        this.singleSpecialData = items;
        callBack && callBack(tempIndex)
    }

    /**
     * 获取精选频道列表内容
     */
    @action
    setSpecialIndex(obj, index) {
        this.specialIndex = index;
    }

    /**
     * 获取精选频道列表内容
     */
    @action
    getSpecialList(spId) {
        let pageNum = 1;
        this.specialListId = spId;
        if (this.specialList[spId]) {
            let { currentPage } = this.specialList[spId]
            pageNum = currentPage++
        }
        let params = {
            currentPage: pageNum,
            numsPerPage: 50,
            spid: spId,
        }
        NetUtils.get(Api.HOME_SPECIAL_LIST, params).then((result) => {
            if (result && result.data && result.data && result.data.items.length > 0) {
                const { items, specialResponse } = result.data
                runInAction(() => {
                    // if (this.specialList[spId]) {
                    //     this.specialList[spId].currentPage = pageNum
                    //     let newArray = new Array();
                    //     newArray = newArray.concat(toJS(this.specialList[spId].items))
                    //     newArray = newArray.concat(items)
                    //     this.specialList[spId].items = newArray
                    // } else {
                    this.specialList[spId] = {}
                    this.specialList[spId].currentPage = pageNum
                    this.specialList[spId].items = items
                    this.specialList[spId].specialResponse = specialResponse
                    const { spStartTime, spCurrentTime, spEndTime } = specialResponse
                    const star = moment(spStartTime);
                    const current = moment(spCurrentTime);
                    const end = moment(spEndTime);
                    if (current >= star) {
                        this.specialList[spId].isSelling = true;
                        this.specialList[spId].countTime = end - current
                    } else {
                        this.specialList[spId].isSelling = false;
                        this.specialList[spId].countTime = star - current
                    }
                    //}
                })
            }
        }).catch((e) => {
            runInAction(() => {

            })
        })
    }

    /**
     * 获取礼包专区
     */
    @action
    getGiftId(callBack) {
        NetUtils.get(Api.HOME_GIFT_ID).then((result) => {
            try {
                this.getSpecialList(result.data[0].spId);
                callBack && callBack(result.data[0].spId)
            } catch (error) {
            }
        }).catch((e) => {
            runInAction(() => {
            })
        })
    }


    /***旧的分割线 */


    /**
     * 获取首页类目列表
     */
    @action
    getCategories() {
        let params = {
            platformType: 1,
        }
        console.log(Api.HOME_CATEGORIES_NEW);
        NetUtils.get(Api.HOME_CATEGORIES_NEW, params).then((result) => {
            if (result && result.data && result.data && result.data.items.length > 0) {
                runInAction(() => {
                    this.categoriesList = result.data.items;
                    Storage.save({
                        key: Constant.HOME_CAT_DATA,
                        data: JSON.parse(JSON.stringify(this.categoriesList)),
                    });
                })
            }
        }).catch(() => {
        })
    }

    /**
     * banner
     * @param {*} catIndex 
     */
    @action
    getCategoriesSecond(catIndex) {
        const tempCategories = this.categoriesList[catIndex];
        const { categoryId, id } = tempCategories;

        let params = {
            parentId: id,
        }

        NetUtils.get(Api.HOME_CATEGORIES_SECOND, params).then((result) => {
            if (result && result.data && result.data.items) {
                runInAction(() => {
                    this.categoriesList[catIndex].childList = result.data.items;
                })
            }
        }).catch(() => {
        })
    }

    @action
    getFlashSaleList(callBack) {
        let params = {
            numsPerPage: 15,
            currentPage: 1
        }

        NetUtils.get(Api.FLASH_SALE_INFO_HOME, params).then((result) => {
            if (result && result.data) {
                runInAction((() => {
                    this.flashSaleData = result.data;
                }))
            }
        }).catch((e) => {
            callBack && callBack()
        })
    }

    /**
     * 获取首页商品列表
     * @param {*} catIndex 类目
     * @param {*} isRefresh 是否刷新
     */
    @action
    getListData(catIndex, isRefresh = false, callBack) {
        if (this.categoriesList && this.categoriesList.length > 0) {
            const tempCategories = this.categoriesList[catIndex];
            const { categoryId, id } = tempCategories;
            let newPage = 1;
            let tempData = { items: [] };

            if (this.listData && this.listData[categoryId] && !isRefresh) {
                newPage = isRefresh ? 1 : this.listData[categoryId].currentPage || 1;
                tempData = JSON.parse(JSON.stringify(toJS(this.listData[categoryId])));
            }

            let params = {
                id: id,
                categoryId: categoryId,
                pageSize: 10,
                currentPage: newPage++,
                sort: "recomend"//recomend,priceLow,priceHigh,sellerHigh
            }

            NetUtils.get(Api.PRODUCT_LIST, params).then((result) => {
                if (result && result.data && result.data.items && result.data.items.length > 0) {
                    if (tempData) {
                        tempData.items = tempData.items.concat(result.data.items)
                    } else {
                        tempData = { items: result.data.items };
                    }
                    tempData.currentPage = newPage;
                    runInAction(() => {
                        this.listData[categoryId] = tempData;
                        callBack && callBack()
                        Storage.save({
                            key: Constant.HOME_LIST_DATA,
                            data: JSON.parse(JSON.stringify(this.listData)),
                        });
                    })
                } else {
                    runInAction(() => {
                        this.listData[categoryId] = tempData;
                        callBack && callBack(true)
                    })
                }
            }).catch((e) => {
                callBack && callBack()
                console.log('=====getListDataeeeeee==', e);
            })
        }
    }

    @action
    getProductListDataById(id, isRefresh = false, callBack) {
        let newPage = 1;
        let tempData = { items: [] };

        if (this.productListData && !isRefresh) {
            newPage = isRefresh ? 1 : this.productListData.currentPage || 1;
            tempData = JSON.parse(JSON.stringify(toJS(this.productListData)));
        }

        let params = {
            id: id,
            categoryId: id,
            pageSize: 10,
            currentPage: newPage++,
            sort: "recomend"//recomend,priceLow,priceHigh,sellerHigh
        }

        NetUtils.get(Api.PRODUCT_LIST, params).then((result) => {
            if (result && result.data && result.data.items && result.data.items.length > 0) {
                if (tempData) {
                    tempData.items = tempData.items.concat(result.data.items)
                } else {
                    tempData = { items: result.data.items };
                }
                if (result.data.categoryName) {
                    tempData.categoryName = result.data.categoryName
                }
                tempData.currentPage = newPage;
                runInAction(() => {
                    this.productListData = tempData;
                    callBack && callBack()
                })
            } else {
                runInAction(() => {
                    this.productListData = tempData;
                    callBack && callBack(true)
                })
            }
        }).catch((e) => {
            callBack && callBack()
            console.log('=====productListData==', e);
        })
    }

    @action
    getHighBonus(isRefresh = false, callBack) {
        const { storeId } = ShopStore.storeInfo;

        let newPage = 1;
        let tempData = { items: [] };

        if (this.highBonusData && !isRefresh) {
            newPage = isRefresh ? 1 : this.highBonusData.currentPage || 1;
            tempData = JSON.parse(JSON.stringify(toJS(this.highBonusData)));
        }

        let params = {
            storeId: storeId,
            numsPerPage: 15,
            currentPage: newPage++
        }

        NetUtils.get(Api.HIGH_BONUS, params).then((result) => {
            if (result && result.data && result.data.items && result.data.items.length > 0) {
                if (tempData) {
                    tempData.items = tempData.items.concat(result.data.items)
                } else {
                    tempData = { items: result.data.items };
                }

                tempData.currentPage = newPage;

                runInAction(() => {
                    this.highBonusData = tempData;
                    callBack && callBack()
                    Storage.save({
                        key: Constant.HOME_HIGH_BONUS,
                        data: JSON.parse(JSON.stringify(this.highBonusData)),
                    });
                })
            } else {
                runInAction(() => {
                    this.highBonusData = tempData;
                    callBack && callBack(true)
                })
            }
        }).catch((e) => {
            callBack && callBack()
        })
    }

    @action
    getDailyNew(isRefresh = false, callBack) {
        const { storeId } = ShopStore.storeInfo;

        let newPage = 1;
        let tempData = { items: [] };

        if (this.dailyNewData && !isRefresh) {
            newPage = isRefresh ? 1 : this.dailyNewData.currentPage || 1;
            tempData = JSON.parse(JSON.stringify(toJS(this.dailyNewData)));
        }

        let params = {
            storeId: storeId,
            numsPerPage: 15,
            currentPage: newPage++
        }

        NetUtils.get(Api.DAILY_NEW, params).then((result) => {
            if (result && result.data && result.data.items && result.data.items.length > 0) {
                if (tempData) {
                    tempData.items = tempData.items.concat(result.data.items)
                } else {
                    tempData = { items: result.data.items };
                }
                tempData.currentPage = newPage;

                runInAction(() => {
                    this.dailyNewData = tempData;
                    callBack && callBack()
                    Storage.save({
                        key: Constant.HOME_DAILY_NEW,
                        data: JSON.parse(JSON.stringify(this.highBonusData)),
                    });
                })
            } else {
                runInAction(() => {
                    this.dailyNewData = tempData;
                    callBack && callBack(true)
                })
            }
        }).catch((e) => {
            callBack && callBack()
        })
    }

    @action
    getRecommended(isRefresh = false, callBack) {
        const { storeId } = ShopStore.storeInfo;

        let newPage = 1;
        let tempData = { items: [] };

        if (this.homeRecommendData && !isRefresh) {
            newPage = isRefresh ? 1 : this.homeRecommendData.currentPage || 1;
            tempData = JSON.parse(JSON.stringify(toJS(this.homeRecommendData)));
        }

        let params = {
            storeId: storeId,
            numsPerPage: 15,
            currentPage: newPage++
        }

        NetUtils.get(Api.HOME_RECOMMENDED, params).then((result) => {
            if (result && result.data && result.data.items && result.data.items.length > 0) {
                let onSaleItems = [];
                result.data.items.map((obj, index) => {
                    if (obj.isSoldOut + '' !== '0') {
                        onSaleItems.push(obj)
                    }
                })

                if (tempData) {
                    if (isRefresh) {
                        tempData.items = onSaleItems
                    } else {
                        tempData.items = tempData.items.concat(onSaleItems)
                    }
                } else {
                    tempData = { items: onSaleItems };
                }
                tempData.currentPage = newPage;

                runInAction(() => {
                    this.homeRecommendData = tempData;
                    callBack && callBack()
                })
            } else {
                runInAction(() => {
                    this.homeRecommendData = tempData;
                    callBack && callBack(true)
                })
            }
        }).catch((e) => {
            callBack && callBack()
        })
    }

    /**
     * 获取首页专场商品列表
     * @param {*} catIndex 类目
     * @param {*} isRefresh 是否刷新
     */
    @action
    getCollectionListData(linkId, isRefresh = false, callBack) {
        // const tempCategories = this.categoriesList[catIndex];
        // const { linkId } = tempCategories;
        let newPage = 1;
        let tempData = { items: [] };

        if (this.listData && this.listData[linkId] && !isRefresh) {
            newPage = isRefresh ? 1 : this.listData[linkId].currentPage || 1;
            tempData = JSON.parse(JSON.stringify(toJS(this.listData[linkId])));
        }

        let params = {
            // id: id,
            collectionId: linkId,
            currentPage: newPage++,
            numsPerPage: 10,
            // sort: "recomend"//recomend,priceLow,priceHigh,sellerHigh
        }

        NetUtils.get(Api.COLLECTION_LIST, params).then((result) => {
            if (result && result.data && result.data.items && result.data.items.length > 0) {
                if (tempData) {
                    tempData.items = tempData.items.concat(result.data.items)
                } else {
                    tempData = { items: result.data.items };
                }
                tempData.currentPage = newPage;
                runInAction(() => {
                    this.listData[linkId] = tempData;
                    this.collectionTitles[linkId] = result.data.collectionName;
                    callBack && callBack()
                    Storage.save({
                        key: Constant.HOME_LIST_DATA,
                        data: JSON.parse(JSON.stringify(this.listData)),
                    });
                })
            } else {
                runInAction(() => {
                    this.listData[linkId] = tempData;
                    this.collectionTitles[linkId] = result.data.collectionName;
                    callBack && callBack(true)
                })
            }
        }).catch((e) => {
            callBack && callBack()
            console.log('=====getListDataeeeeee==', e);
        })
    }

}

export default new HomeStore();


const FLASH_SPECIAL_DATA = {
    "items": [{
        "spEndTime": "2019-04-27 00:00:00",
        "spStartTime": "2019-01-24 00:00:00",
        "spCurrentTime": "2019-02-28 00:56:38",
        "spGoodsNum": 6,
        "spId": 183,
        "dateFormat": "1月24日",
        "timeFormat": "12:00 PT",
        "postInfo": null,
        "spWeight": 90,
        "spTitleCn": "饮品专场",
        "spColor": "#4E94F3",
        "spTitleEn": "饮品专场",
        "spSubTitleEn": "乐事薯片特惠专场",
        "spSubTitleCn": "$10任选2件",
        "spBannerImgCn": "https://img.alicdn.com/tps/i4/TB1dnb8zSzqK1RjSZFLSuwn2XXa.jpg_970x970Q90s50.jpg",
        "spBgImgCn": "",
        "spBgImgEn": "",
        "spBannerImgEn": "https://img.alicdn.com/tps/i4/TB1dnb8zSzqK1RjSZFLSuwn2XXa.jpg_970x970Q90s50.jpg",
        "spStatus": null
    }, {
        "spEndTime": "2019-05-24 00:00:00",
        "spStartTime": "2019-01-03 00:00:00",
        "spCurrentTime": "2019-02-28 00:56:38",
        "spGoodsNum": 31,
        "spId": 181,
        "dateFormat": "1月03日",
        "timeFormat": "12:00 PT",
        "postInfo": null,
        "spWeight": 21,
        "spTitleCn": "女性服装专场",
        "spColor": "#EAEAEA",
        "spTitleEn": "女性服装专场",
        "spSubTitleEn": "女性服装专场",
        "spSubTitleCn": "你不来就错过几个亿啦",
        "spBannerImgCn": "http://img14.360buyimg.com/n2/jfs/t1/30681/35/155/274946/5c384c85E544b4cf0/22b4682c00bffaf1.jpg",
        "spBgImgCn": "http://img14.360buyimg.com/n2/jfs/t1/30681/35/155/274946/5c384c85E544b4cf0/22b4682c00bffaf1.jpg",
        "spBgImgEn": "http://img14.360buyimg.com/n2/jfs/t1/30681/35/155/274946/5c384c85E544b4cf0/22b4682c00bffaf1.jpg",
        "spBannerImgEn": "http://img14.360buyimg.com/n2/jfs/t1/30681/35/155/274946/5c384c85E544b4cf0/22b4682c00bffaf1.jpg",
        "spStatus": null
    }, {
        "spEndTime": "2019-05-31 00:00:00",
        "spStartTime": "2019-02-10 00:00:00",
        "spCurrentTime": "2019-02-28 00:56:38",
        "spGoodsNum": 2,
        "spId": 204,
        "dateFormat": "2月10日",
        "timeFormat": "12:00 PT",
        "postInfo": null,
        "spWeight": 0,
        "spTitleCn": "测试专场",
        "spColor": "#fff",
        "spTitleEn": "测试专场",
        "spSubTitleEn": "测试专场",
        "spSubTitleCn": "测试专场",
        "spBannerImgCn": "https://cdncollection.oscart.com//oscart-op/20190214banner/shenghuo20190214.png",
        "spBgImgCn": "",
        "spBgImgEn": "",
        "spBannerImgEn": "https://cdncollection.oscart.com//oscart-op/20190214banner/shenghuo20190214.png",
        "spStatus": null
    }],
    "postInfo": {
        "id": 107,
        "postage": 12,
        "freePrice": 20,
        "createTime": "2019-01-19 03:15:41",
        "updateTime": "2019-01-19 03:15:41",
        "isDeleted": 0
    }
}

const SINGLE_SPECIAL_DATA = {
    "items": [{
        "spEndTime": "2019-04-30 00:00:00",
        "spStartTime": "2018-12-01 00:00:00",
        "spCurrentTime": "2019-02-26 21:56:30",
        "spGoodsNum": 5,
        "spId": 195,
        "dateFormat": "12月01日",
        "timeFormat": "12:00 PT",
        "postInfo": null
    }, {
        "spEndTime": "2019-02-28 23:59:00",
        "spStartTime": "2019-01-14 00:00:00",
        "spCurrentTime": "2019-02-26 21:56:30",
        "spGoodsNum": 2,
        "spId": 198,
        "dateFormat": "1月14日",
        "timeFormat": "12:00 PT",
        "postInfo": null
    }, {
        "spEndTime": "2019-04-26 00:00:00",
        "spStartTime": "2019-01-22 00:00:00",
        "spCurrentTime": "2019-02-26 21:56:30",
        "spGoodsNum": 29,
        "spId": 201,
        "dateFormat": "1月22日",
        "timeFormat": "12:00 PT",
        "postInfo": null
    }, {
        "spEndTime": "2019-04-30 00:00:00",
        "spStartTime": "2019-02-23 00:00:00",
        "spCurrentTime": "2019-02-26 21:56:30",
        "spGoodsNum": 1,
        "spId": 212,
        "dateFormat": "2月23日",
        "timeFormat": "12:00 PT",
        "postInfo": null
    }],
    "postInfo": {
        "id": 107,
        "postage": 12,
        "freePrice": 20,
        "createTime": "2019-01-19 03:15:41",
        "updateTime": "2019-01-19 03:15:41",
        "isDeleted": 0
    }
}

const SPECIAL_LIST_DATA = {
    "numsPerPage": 20,
    "count": 5,
    "currentPage": 1,
    "totalPages": 1,
    "unit": "$",
    "specialResponse": {
        "spEndTime": "2019-04-27 00:00:00",
        "spStartTime": "2019-01-24 00:00:00",
        "spCurrentTime": "2019-02-28 23:03:14",
        "spGoodsNum": 6,
        "spId": 183,
        "dateFormat": null,
        "timeFormat": null,
        "postInfo": null,
        "spWeight": 90,
        "spTitleCn": "饮品专场",
        "spColor": "#4E94F3",
        "spTitleEn": "饮品专场",
        "spSubTitleEn": "乐事薯片特惠专场",
        "spSubTitleCn": "$10任选2件",
        "spBannerImgCn": "https://img.alicdn.com/tps/i4/TB1dnb8zSzqK1RjSZFLSuwn2XXa.jpg_970x970Q90s50.jpg",
        "spBgImgCn": "",
        "spBgImgEn": "",
        "spBannerImgEn": "https://img.alicdn.com/tps/i4/TB1dnb8zSzqK1RjSZFLSuwn2XXa.jpg_970x970Q90s50.jpg",
        "spStatus": 2
    },
    "freePost": {
        "id": 165,
        "roleNameCn": "195单品专场",
        "roleNameEn": "195 totle",
        "collectionId": "195",
        "minPiece": 5,
        "minPrice": 5,
        "isVaild": 1,
        "createTime": "2019-01-15 09:36:02",
        "updateTime": "2019-01-15 09:36:09",
        "isDeleted": 0
    },
    "postInfo": {
        "id": 107,
        "postage": 12,
        "freePrice": 20,
        "createTime": "2019-01-19 03:15:41",
        "updateTime": "2019-01-19 03:15:41",
        "isDeleted": 0
    },
    "items": [{
        "sku": "T2689453381454912273",
        "skuErp": "T26894533811",
        "skuName": "Starbucks星巴克圣诞款12oz针织系列马克杯铃铛造型搅拌棒组合款",
        "recommend": "非常不错的星爸爸杯子",
        "spu": "T268945338",
        "limitSellMax": 0,
        "status": 0,
        "propertyMainValue": 14549,
        "photo": "https://cdncollection.oscart.com//oscart-dev/goods/t268945338/white/1.jpg",
        "sellPrice": 3,
        "marketPrice": 0,
        "commission": 2.31,
        "spgId": 195,
        "spgMinimum": 1,
        "spgMaximum": 10
    }, {
        "sku": "T0707297271454912273",
        "skuErp": "T07072972715",
        "skuName": "Starbucks 星巴克 12oz珠光发纹双层马克杯 天猫精选款",
        "recommend": "非常不错的星爸爸杯子",
        "spu": "T070729727",
        "limitSellMax": 0,
        "status": 0,
        "propertyMainValue": 14549,
        "photo": "https://cdncollection.oscart.com//oscart-dev/goods/t070729727/white/1.jpg",
        "sellPrice": 3,
        "marketPrice": 0,
        "commission": 2.31,
        "spgId": 195,
        "spgMinimum": 1,
        "spgMaximum": 10
    }, {
        "sku": "T432088851429431",
        "skuErp": "T43208885136",
        "skuName": "星巴克臻选 2.3oz Fellow双层白色陶瓷对杯",
        "recommend": "非常不错的星爸爸杯子",
        "spu": "T432088851",
        "limitSellMax": 48,
        "status": 0,
        "propertyMainValue": 429,
        "photo": "https://img.alicdn.com/imgextra/i3/2634283647/O1CN01gSiNkB1coMwBwSbQm_!!0-item_pic.jpg_430x430q90.jpg",
        "sellPrice": 3,
        "marketPrice": 0,
        "commission": 2.31,
        "spgId": 195,
        "spgMinimum": 1,
        "spgMaximum": 10
    }, {
        "sku": "T8940382531454912273",
        "skuErp": "T89403825385",
        "skuName": "星巴克 12oz小猪俏皮双层马克杯 天猫精选款",
        "recommend": "非常不错的星爸爸杯子",
        "spu": "T894038253",
        "limitSellMax": 37,
        "status": 0,
        "propertyMainValue": 14549,
        "photo": "https://cdncollection.oscart.com//oscart-dev/goods/t894038253/white/1.jpg",
        "sellPrice": 3,
        "marketPrice": 0,
        "commission": 2.31,
        "spgId": 195,
        "spgMinimum": 1,
        "spgMaximum": 10
    }, {
        "sku": "TU190110040146098196568",
        "skuErp": "TU19011004002",
        "skuName": "花王乐而雅 S系列卫生巾 超薄瞬吸 日用20.5cm 28片入*2包",
        "recommend": "",
        "spu": "TU190110040",
        "limitSellMax": 48,
        "status": 0,
        "propertyMainValue": 146098,
        "photo": "http://collection.oscart.com/oscart-prod/goods/tu190110040/riyong/01.jpg",
        "sellPrice": 3,
        "marketPrice": 19.76,
        "commission": 2.31,
        "spgId": 195,
        "spgMinimum": 1,
        "spgMaximum": 10
    }]
}

const AAA = {
    "numsPerPage": 20,
    "count": 5,
    "currentPage": 1,
    "totalPages": 1,
    "unit": "$",
    "specialResponse": {
        "spEndTime": "2019-04-27 00:00:00",
        "spStartTime": "2019-01-24 00:00:00",
        "spCurrentTime": "2019-02-28 23:03:14",
        "spGoodsNum": 6,
        "spId": 183,
        "dateFormat": null,
        "timeFormat": null,
        "postInfo": null,
        "spWeight": 90,
        "spTitleCn": "饮品专场",
        "spColor": "#4E94F3",
        "spTitleEn": "饮品专场",
        "spSubTitleEn": "乐事薯片特惠专场",
        "spSubTitleCn": "$10任选2件",
        "spBannerImgCn": "https://img.alicdn.com/tps/i4/TB1dnb8zSzqK1RjSZFLSuwn2XXa.jpg_970x970Q90s50.jpg",
        "spBgImgCn": "",
        "spBgImgEn": "",
        "spBannerImgEn": "https://img.alicdn.com/tps/i4/TB1dnb8zSzqK1RjSZFLSuwn2XXa.jpg_970x970Q90s50.jpg",
        "spStatus": 2
    },
    "freePost": {
        "id": 165,
        "roleNameCn": "195单品专场",
        "roleNameEn": "195 totle",
        "collectionId": "195",
        "minPiece": 5,
        "minPrice": 5,
        "isVaild": 1,
        "createTime": "2019-01-15 09:36:02",
        "updateTime": "2019-01-15 09:36:09",
        "isDeleted": 0
    },
    "postInfo": {
        "id": 107,
        "postage": 12,
        "freePrice": 20,
        "createTime": "2019-01-19 03:15:41",
        "updateTime": "2019-01-19 03:15:41",
        "isDeleted": 0
    },
    "items": [{
        "sku": "T2689453381454912273",
        "skuErp": "T26894533811",
        "skuName": "星巴克圣诞款1",
        "recommend": "非常不错的星爸爸杯子",
        "spu": "T268945338",
        "limitSellMax": 0,
        "status": 0,
        "propertyMainValue": 14549,
        "photo": "https://cdncollection.oscart.com//oscart-dev/goods/t268945338/white/1.jpg",
        "sellPrice": 3,
        "marketPrice": 0,
        "commission": 2.31,
        "spgId": 195,
        "spgMinimum": 1,
        "spgMaximum": 10
    }, {
        "sku": "T0707297271454912273",
        "skuErp": "T07072972715",
        "skuName": "星巴克圣诞款12",
        "recommend": "非常不错的星爸爸杯子",
        "spu": "T070729727",
        "limitSellMax": 0,
        "status": 0,
        "propertyMainValue": 14549,
        "photo": "https://cdncollection.oscart.com//oscart-dev/goods/t070729727/white/1.jpg",
        "sellPrice": 3,
        "marketPrice": 0,
        "commission": 2.31,
        "spgId": 195,
        "spgMinimum": 1,
        "spgMaximum": 10
    }, {
        "sku": "T432088851429431",
        "skuErp": "T43208885136",
        "skuName": "星巴克圣诞款13",
        "recommend": "非常不错的星爸爸杯子",
        "spu": "T432088851",
        "limitSellMax": 48,
        "status": 0,
        "propertyMainValue": 429,
        "photo": "https://img.alicdn.com/imgextra/i3/2634283647/O1CN01gSiNkB1coMwBwSbQm_!!0-item_pic.jpg_430x430q90.jpg",
        "sellPrice": 3,
        "marketPrice": 0,
        "commission": 2.31,
        "spgId": 195,
        "spgMinimum": 1,
        "spgMaximum": 10
    }, {
        "sku": "T8940382531454912273",
        "skuErp": "T89403825385",
        "skuName": "星巴克圣诞款14",
        "recommend": "非常不错的星爸爸杯子",
        "spu": "T894038253",
        "limitSellMax": 37,
        "status": 0,
        "propertyMainValue": 14549,
        "photo": "https://cdncollection.oscart.com//oscart-dev/goods/t894038253/white/1.jpg",
        "sellPrice": 3,
        "marketPrice": 0,
        "commission": 2.31,
        "spgId": 195,
        "spgMinimum": 1,
        "spgMaximum": 10
    }, {
        "sku": "TU190110040146098196568",
        "skuErp": "TU19011004002",
        "skuName": "星巴克圣诞款15",
        "recommend": "",
        "spu": "TU190110040",
        "limitSellMax": 48,
        "status": 0,
        "propertyMainValue": 146098,
        "photo": "http://collection.oscart.com/oscart-prod/goods/tu190110040/riyong/01.jpg",
        "sellPrice": 3,
        "marketPrice": 19.76,
        "commission": 2.31,
        "spgId": 195,
        "spgMinimum": 1,
        "spgMaximum": 10
    }]
} 