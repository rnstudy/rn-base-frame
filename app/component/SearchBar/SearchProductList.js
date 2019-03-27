import React, { Component } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    InteractionManager
} from 'react-native';
import CommonHeader, { NAVIGATION_HIDE } from '../../component/Header/CommonHeader';
import { inject } from 'mobx-react/native';
import Utils from '../../utils/Utils';
import * as Constant from '../../utils/Constant'
import { Actions } from 'react-native-router-flux';
import arrow_down from '../../res/img/arrow_down.png';
import RB_SEL from '../../res/img/rb_select.png';
import RB_NOSEL from '../../res/img/rb_noselect.png';
import HorizontalItem from '../../component/HomeItem/HorizontalItem';
import I18n from '../../config/i18n'
import Toast from "../../component/GoodsDetailModal/Toast";
import EMPTY from '../../res/img/oops_list_empty.png';
import { toJS } from '../../../node_modules/mobx';
import HOME_LOADING from '../../res/img/home_loading.gif';
import LIST_EMPTY from '../../res/img/oops_list_empty.png';
import BackIcon from '../../res/img/arrow_back.png';
import MenuIcon from '../../res/img/navi_menu.png';
import Magnifier from '../../res/img/magnifier.png';
import OText from '../../component/OText/OText';
import OTextInput from '../../component/OTextInput/OTextInput';
import CloseIcon from '../../res/img/navi_close.png'
import TextHighlight from '../../component/react-native-text-highlight/index'
import SearchBar from "./SearchBar"
import SearchPage from "./SearchPage"

const { width, height } = Dimensions.get('window');

@inject(stores => ({
    searchStore: stores.searchStore,
}))

export default class SearchProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // keyword: props.keyword,
            listData: [],

            animValue: new Animated.Value(0),
            showSearchPage: 0, //标志位
        }
    }

    componentWillMount() {
        // this.getProductListData(true, this.state.keyword);
        this.getProductListData(true, this.props.searchStore.searchBorderValue);
    }

    render() {
        // console.log(this.state.keyword);
        return (
            <CommonHeader
                titleType={NAVIGATION_HIDE}
                containerStyles={{ paddingBottom: 0 }}
            >
                <SearchBar
                    // keyword={this.state.keyword}
                    keyword={this.props.searchStore.searchBorderValue}
                    showBackIcon={true}
                    showRightView={false}
                    onPress={() => this.onPressSearchBar()}
                />
                {this.state.listData.length > 0 && this.renderList()}

                <Animated.View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    transform: [ //位置动画（可以思考一下：下面的元素顺序不同会有不同效果）
                        {
                            translateY: this.state.animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [height, 0] //线性插值，0对应-100，1对应0
                            })
                        },
                    ]
                }}>
                    <SearchPage
                        onPressClose={() => this.onPressSearchBar()}
                        refreshProductList={(itemData) => this.refreshData(itemData)}
                    // keyword={this.state.keyword}
                    />
                </Animated.View>
            </CommonHeader>
        )
    }

    renderList() {
        let keyword = this.props.searchStore.searchBorderValue;
        return (
            <FlatList
                ref='flatList'
                keyExtractor={(item, index) => (item.productId + '' + index)}
                style={styles.scrollBg}
                // onRefresh={() => this.getProductListData(true, this.state.keyword)}
                onRefresh={() => this.getProductListData(true, keyword)}
                data={this.state.listData}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                refreshing={false}
                ListEmptyComponent={this.emptyView()}
                onEndReached={() => {
                    this.getProductListData(false, keyword)
                }}
                onEndReachedThreshold={0.1}
                ListFooterComponent={this.renderFooterComponent()}
            />
        )
    }

    renderItem(item, index) {
        return (
            <HorizontalItem
                item={item}
            />
        )
    }

    getProductListData(isRefresh = false, keyword) {
        this.props.searchStore.searchProductList(isRefresh, keyword, (listData) => {
            this.setState({ listData: listData, }, () => {
                setTimeout(() => {
                    InteractionManager.runAfterInteractions(() => {
                        try {
                            isRefresh && this.refs.flatList.scrollToIndex({ index: 0 })
                        } catch (error) {
                        }
                    })
                }, 200)
            })
        });
    }

    refreshData(itemData) {
        // this.setState({
        //     keyword: itemData.source,
        // })
        this.props.searchStore.setSearchBorderValue(itemData.source);
        this.getProductListData(true, itemData.source);
    }

    emptyView() {
        return (
            <View style={[styles.listStyle, { alignItems: 'center' }]}>
                <Image
                    source={EMPTY}
                    style={styles.emptyImage}
                />
                <OText
                    text={'TEXT_COLLECTION_LIST_EMPTY'}
                    style={styles.noGoodsTitle}
                />

                <OText
                    text={'FIRST_BULLET_GOLD_APP_ONE'}
                    style={styles.noGoodsDetail}
                >
                    <OText
                        text={'FIRST_BULLET_GOLD_APP_TWO'}
                        style={[styles.noGoodsDetail, { color: Constant.themeText }]}
                    // onPress={() => this.onToHomePage()}
                    />
                </OText>
            </View>
        )
    }

    renderFooterComponent() {
        return (
            <View style={{ width: '100%', height: Utils.scale(34) }} />
        )
    }

    searchBarLeftAction() {
        // console.log('商品列表点返回');
        // this.moveY();
        Actions.pop();
    }

    onPressSearchBar() {
        this.moveY();
    }

    moveY() {
        let { searchStore } = this.props;
        // console.log(searchStore.searchBorderValue);

        searchStore.setSearchTextInputValue(searchStore.searchBorderValue);
        searchStore.setNeedSearchTextInput(true);
        searchStore.setNeedSearchKeyword(true);

        let showAnimated = this.state.showSearchPage == 1 ? 0 : 1
        this.setState({
            showSearchPage: showAnimated,
        })

        Animated.timing(this.state.animValue, {
            toValue: showAnimated,
            duration: 300,
        }).start()


    }
}

const styles = StyleSheet.create({
    defaultImage: {
        width: '100%',
        // height: '100%',
        height: height - Utils.scale(200),
        alignItems: 'center',
        justifyContent: 'center',
    },
})