import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from "../OText/OText";
import I18n from "../../config/i18n";
import { Actions } from "react-native-router-flux";
import { toJS } from 'mobx';
import ShareFlashSaleCollection from "../../component/ShareModal/ShareFlashSaleCollection.js";
const { width, height } = Dimensions.get("window");
import AppSetting from "../../store/AppSetting";
import { inject, observer } from "mobx-react/native";
import moment from 'moment';
@inject(stores => ({
    homeStore: stores.homeStore,
    shopStore: stores.shopStore,
}))
@observer
export default class SingleSpecial extends Component {

    componentWillMount() {

    }

    componentDidMount() {
        this.props.homeStore.getSingleSpecial((index) => {
            this.getDataCallBack(index)
        });
    }

    getDataCallBack(index) {
        try {
            const { singleSpecialData } = this.props.homeStore;
            this.props.homeStore.getSpecialList(singleSpecialData[index].spId)
            setTimeout(() => {
                try {
                    if (index > 2) {
                        let temp = (index - 1) * 60
                        this.refs.specialScroll && this.refs.specialScroll.scrollTo({ y: 0, x: temp, animated: false })
                    }
                } catch (error) {
                }
            }, 1000)
        } catch (error) {
            console.log('----', error);
        }
    }

    pressItem(obj, index) {
        this.props.homeStore.setSpecialIndex(obj, index)
        this.props.homeStore.getSpecialList(obj.spId)
    }

    renderItem(obj, index) {
        const { timeFormat, isSelling, spStartTime } = obj;
        const { specialIndex } = this.props.homeStore;

        let time = `${moment(spStartTime).format("HH:mm")}PT`
        let textStyle = styles.itemText;
        let stateText = styles.itemStateText;
        let oText = 'COLLECTION.TEXT_FLASHSALE_ONSALE'
        if (!isSelling) {
            stateText = [styles.itemStateText, { color: Constant.lightText }]
            oText = 'COLLECTION.TEXT_FLASHSALE_UPCOMING'
        }
        if (specialIndex + '' === '' + index) {
            textStyle = [styles.itemText, { color: Constant.themeText }];
            stateText = [styles.itemStateText, { color: Constant.themeText }]
        }
        return (
            <TouchableOpacity
                style={styles.itemStyle}
                key={index}
                onPress={() => this.pressItem(obj, index)}
            >
                <Text style={textStyle}>{time}</Text>
                <OText
                    text={oText}
                    style={stateText}
                />
            </TouchableOpacity>
        )
    }

    openShare() {
        try {
            const { homeStore, shopStore } = this.props;
            const { storeInfo } = shopStore
            const { specialListId, specialList, unit } = homeStore;
            const { items, specialResponse } = specialList[specialListId];
            const { spId, spTitleCn } = specialResponse;
            let productPic = [];
            for (const iterator of items) {
                if (productPic.length < 4) {
                    productPic.push(iterator.photo)
                }
            }
            let itemData = {
                productPic,
                unit,
                collectionName: spTitleCn,
                collectionId: spId
            }


            const shareData = Utils.setShareCollectionData(
                storeInfo,
                itemData,
                AppSetting.BaseUrl,
                AppSetting.getCurrentLanguage.code,
                unit
            );
            this.refs.ShareModal.openModal(shareData);

        } catch (error) {
            console.log("=========openShare=error===", error);
        }
    }

    //渲染
    render() {
        const { singleSpecialData } = this.props.homeStore
        if (singleSpecialData && singleSpecialData.length > 0) {
            if (singleSpecialData.length < 2) {
                return <View style={[styles.container, {
                    width: width,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    marginBottom: Utils.scale(20),
                }]}>
                    {singleSpecialData.map((obj, index) => {
                        return this.renderItem(obj, index)
                    })}
                </View>
            }
            return (<View style={styles.container}>
                <ScrollView
                    ref={'specialScroll'}
                    style={styles.scrollStyle}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {singleSpecialData.map((obj, index) => {
                        return this.renderItem(obj, index)
                    })}
                </ScrollView>
                <ShareFlashSaleCollection ref={"ShareModal"} />
            </View>
            )
        } else {
            return <View />
        }
    }
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        backgroundColor: 'white'
    },
    scrollStyle: {
        marginTop: Utils.scale(18),
        marginBottom: Utils.scale(20),
    },

    itemStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Utils.scale(16),
        marginRight: Utils.scale(16),
        width: Utils.scale(80),
    },
    itemText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(18),
        fontWeight: 'bold',
    },
    itemStateText: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(12),
    },

});




