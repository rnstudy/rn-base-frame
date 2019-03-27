import React, { Component } from "react";
import {
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    
} from "react-native";
import Utils from "../../utils/Utils";
import * as Constant from "../../utils/Constant";
import OText from "../../component/OText/OText";
import I18n from "../../config/i18n";
import { Actions } from "react-native-router-flux";
import SHARE_ICON from '../../res/images/share_icon.png';
import { toJS } from "mobx";
import SpecialListCount from "../../component/HomeItem/SpecialListCount";
import SpecialItem from "../../component/HomeItem/SpecialItem";
import { inject, observer } from "mobx-react/native";
import moment from "moment";
import BackIcon from "../../component/BackIcon/BackIcon";
import ShopCartIcon from "../../component/ShopCartIcon/ShopCartIcon";
import Button from "../../component/Button";
import ShareFlashSaleCollection from "../../component/ShareModal/ShareFlashSaleCollection.js";
import ShopStore from "../../store/ShopStore";
import AppSetting from "../../store/AppSetting";

@inject(stores => ({
    homeStore: stores.homeStore
}))
@observer
export default class FlashSpecial extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.props.homeStore.getSpecialList(this.props.spId);
    }

    renderHead() {
        return (
            <View style={styles.headView}>
                <BackIcon />
                <View style={{ flexDirection: 'row' }}>
                    <ShopCartIcon />
                    <TouchableOpacity
                        style={styles.homeTouchLay}
                        onPress={() => this.pressShare()}>
                        <Image style={styles.iconPerson} source={SHARE_ICON} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderResponseView() {
        try {
            const { spId, homeStore } = this.props;
            const { specialList, unit } = homeStore;
            const { specialResponse, } = specialList[
                spId
            ];
            const { spTitleCn, spSubTitleCn } = specialResponse;
            return (
                <View style={{ margin: Utils.scale(16) }}>
                    <Text style={styles.textTitle}>{spTitleCn}</Text>
                    <Text style={styles.textDetail}>{spSubTitleCn}</Text>

                </View>
            );
        } catch (error) {
            console.log('----', error);
        }
        return <View />;
    }

    renderItem() {
        try {
            const { spId, homeStore } = this.props;
            const { specialList, unit } = homeStore;
            const { items, countTime } = specialList[spId];
            const time = moment(toJS(countTime)).unix();
            return <View style={styles.container}>
                <SpecialListCount countTime={toJS(time)} />
                {items.map((obj, index) => {
                    return (
                        <SpecialItem
                            item={obj}
                            key={index}
                            unit={unit}
                        />
                    );
                })}
            </View>
        } catch (error) {
            console.log('---222-', error);
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
                {this.renderHead()}
                <ScrollView>
                    {this.renderResponseView()}
                    {this.renderItem()}
                    <Button
                        onPress={() => this.pressShare()}
                        style={styles.shareBtn}
                    >
                        <OText
                            text={"COLLECTION_LIST_PAGE.TEXT_SHARE_ERAN"}
                            style={styles.shareBtnText}
                        />
                    </Button>
                    <OText
                        text={"COLLECTION_LIST_PAGE.TEXT_SHARE_TIP"}
                        style={styles.shareTip}
                    />
                    <ShareFlashSaleCollection ref={"ShareModal"} />
                </ScrollView>
            </SafeAreaView>
        );
    }

    pressShare() {
        try {
            const { spId, homeStore } = this.props;
            const { specialList, unit } = homeStore;
            const { items, countTime, specialResponse, postInfo } = specialList[
                spId
            ];
            const time = moment(toJS(countTime)).unix();
            let imgs = [];

            for (let index = 0; index < 4; index++) {
                let el = items[index],
                    url = el && el.photo;
                url && imgs.push(url);
            }

            // 分享参数

            let itemData = {
                collectionName: specialResponse.spTitleCn,
                productPic: imgs,
                collectionId: spId,
                unit: unit,
                freePrice: postInfo && postInfo.freePrice
            };


            const shareData = Utils.setShareCollectionData(
                ShopStore.storeInfo,
                itemData,
                AppSetting.BaseUrl,
                AppSetting.getCurrentLanguage.code,
                itemData.unit
            );
            this.refs.ShareModal.openModal(shareData);
        } catch (error) {
            console.log("=========openShare=error===", error);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "white"
    },
    headView: {
        flexDirection: "row",
        height: Utils.scale(44),
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight: Utils.scale(16)
    },
    textTitle: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(20),
        fontWeight: "bold",
        marginBottom: Utils.scale(10)
    },
    textDetail: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(14),
        marginBottom: Utils.scale(6)
    },
    shareBtn: {
        height: Utils.scale(49),
        backgroundColor: Constant.bottomBtnBg,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Utils.scale(25),
        marginTop: Utils.scale(10),
        marginLeft: Utils.scale(16),
        marginRight: Utils.scale(16),
        marginBottom: Utils.scale(15)
    },
    shareBtnText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: "#fff"
    },
    shareTip: {
        fontSize: Utils.scaleFontSizeFunc(12),
        lineHeight: Utils.scale(16),
        color: "#333333",
        textAlign: "center",
        paddingBottom: Utils.scale(27),
        marginLeft: Utils.scale(16),
        marginRight: Utils.scale(16)
    },
    homeTouchLay: {
        height: Utils.scale(40),
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: Utils.scale(16),
    },

    iconPerson: {
        width: Utils.scale(22),
        height: Utils.scale(22),
    },
});
