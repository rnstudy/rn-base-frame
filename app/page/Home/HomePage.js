/**
 * Created by Administrator on 2017/4/28.
 */

"use strict";
import React, { Component } from "react";
import {
	StyleSheet,
	Dimensions,
	ScrollView,
	Animated,
	SafeAreaView,
	DeviceEventEmitter,
	RefreshControl,
	View,
	Image,
	Text,
	TouchableOpacity
} from "react-native";
// import * as Api from '../../utils/Api';
import I18n from "../../config/i18n";
import HomeHeader from "../../component/Header/HomeHeader";
import BannerView from "../../component/NewHome/BannerView";
import FlashSaleItem from "../../component/NewHome/FlashSaleItem";
import SingleSpecial from "../../component/NewHome/SingleSpecial";
import ShareHomeSale from "../../component/ShareModal/ShareHomeSale";
import SplitLine from "../../component/NewHome/SplitLine";
import SpecialList from "../../component/NewHome/SpecialList";
import OText from "../../component/OText/OText";
import HIGHCOM from "../../res/images/highcommit.png";
import THIRDDAY from "../../res/images/30sell.png";
import GOODSUBMIT from "../../res/images/goodsubmit.png";
import { inject, observer } from "mobx-react/native";
import Utils from "../../utils/Utils";
import SHARE_ICON from '../../res/images/share_icon.png';
import Storage from "../../utils/StorageUtils";
import * as Constant from "../../utils/Constant";
import { Actions } from "react-native-router-flux";
import { toJS } from "mobx";
import AppSetting from "../../store/AppSetting";
const { width, height } = Dimensions.get("window");

@inject(stores => ({
	homeStore: stores.homeStore,
	shopCartStore: stores.shopCartStore,
	shopStore: stores.shopStore,
}))
@observer
export default class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			refreshing: false
		};
	}

	componentWillMount() {
		this.props.shopCartStore.getCartMsg();
		this.getData()
		this.loginListener = DeviceEventEmitter.addListener(Constant.LOGIN_FAIL, () => {
			Actions.reset('Login');
		});

	}

	componentDidMount() {
	}

	getData(isReflash = false) {
		if (this.state.refreshing) {
			return;
		}
		this.props.homeStore.getBannerData();
		this.props.homeStore.getFlashSpecial();
		isReflash && this.props.homeStore.getSingleSpecial();
		this.setState({
			refreshing: true
		}, () => {
			setTimeout(() => {
				this.setState({
					refreshing: false
				})
			}, 5000)
		})
	}

	componentWillUnmount() {
		if (this.loginListener) {
			this.loginListener.remove && this.loginListener.remove()
		}
	}

	renderTips() {
		return (
			<View style={styles.indexTips}>
				<View
					style={styles.tipsView}
				>
					<Image style={styles.smallicon} source={HIGHCOM} />
					<OText style={styles.tipsText} text={'COMMON.TEXT_HIGH_RETURN_COMMISSION'}></OText>
				</View>
				<View
					style={styles.tipsView}
				>
					<Image style={styles.smallicon} source={GOODSUBMIT} />
					<OText style={styles.tipsText} text={'COMMON.TEXT_FREE_RETURN'}></OText>
				</View>
				<View
					style={styles.tipsView}
				>
					<Image style={styles.smallicon}
						source={THIRDDAY}
					/>
					<OText
						style={styles.tipsText}
						text={'COMMON.TEXT_FREE_SHIPPING'}
						option1={{
							unit: '15',
							value: '天'
						}}
					></OText>
				</View>
			</View>
		)
	}

	openShare() {
		try {
			const { homeStore, shopStore } = this.props;
			const { specialList, unit, specialListId } = homeStore;
			const { items, specialResponse, postInfo } = specialList[specialListId];
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
				collectionId: specialListId,
				unit: unit,
				freePrice: postInfo && postInfo.freePrice
			};


			const shareData = Utils.setShareCollectionData(
				shopStore.storeInfo,
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

	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
				<HomeHeader />
				<ScrollView
					stickyHeaderIndices={[6]}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={() => this.getData(true)}
						/>
					}
				>
					<BannerView />
					{this.renderTips()}
					<SplitLine />
					<FlashSaleItem />
					<SplitLine />
					<View style={styles.titleView}>
						<Text style={styles.textTitle}>{I18n('INDEX.TEXT_FLASHSALE')}</Text>
						<TouchableOpacity
							style={styles.shareView}
							onPress={() => this.openShare()}>
							<Image
								source={SHARE_ICON}
								style={styles.shareImage}
							/>
						</TouchableOpacity>
					</View>
					<SingleSpecial />
					<SpecialList />
				</ScrollView>
				<ShareHomeSale ref={"ShareModal"} />
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	indexTips: {
		flexDirection: "row",
		width: width,
		alignItems: "center",
		paddingLeft: Utils.scale(16),
		paddingRight: Utils.scale(16),
		paddingBottom: Utils.scale(16),
		justifyContent: 'space-between',
	},
	tipsView: {
		flexDirection: "row",
	},
	tipsText: {
		fontSize: Utils.scaleFontSizeFunc(12),
		color: Constant.grayText,
		marginLeft: Utils.scale(4),
	},
	smallicon: {
		width: Utils.scale(16),
		height: Utils.scale(16)
	},
	titleView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: Utils.scale(50),
		paddingLeft: Utils.scale(16),
		paddingRight: Utils.scale(16),
	},
	textTitle: {
		color: Constant.blackText,
		fontSize: Utils.scaleFontSizeFunc(18),
		fontWeight: 'bold',
	},
	shareImage: {
		width: Utils.scale(22),
		height: Utils.scale(22),
	},
	shareView: {
		flexDirection: 'row',
	},
});
