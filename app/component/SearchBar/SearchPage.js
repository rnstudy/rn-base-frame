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
    ScrollView,
    DeviceEventEmitter,
} from 'react-native';
import CommonHeader, { NAVIGATION_SUSPENSION, NAVIGATION_BACK } from '../../component/Header/CommonHeader';
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

const { width, height } = Dimensions.get('window');

@inject(stores => ({
    searchStore: stores.searchStore,
}))
export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        // let keyword = props.keyword && props.keyword.length > 0 ? props.keyword : '';
        this.state = {
            // keyword: keyword,
            searchList: [],
        }
    }

    componentWillMount() {
        this.inputListener = DeviceEventEmitter.addListener(Constant.INPUT_LISTENER, (boo) => {
            this.showKeyboard(boo)
        })
    }

    componentWillUnmount() {
        if (this.inputListener) {
            this.inputListener.remove && this.inputListener.remove()
        }
        // 请注意Un"m"ount的m是小写

        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    render() {
        let closeButtonStyle = {}
        let clearButtonStyle = {}
        if (Constant.isIphoneX) {
            closeButtonStyle = { height: Utils.scale(44), marginTop: Utils.scale(44), marginLeft: Utils.scale(16) }
            clearButtonStyle = { height: Utils.scale(44), marginTop: Utils.scale(44), marginRight: Utils.scale(16) }
        } else {
            closeButtonStyle = { height: Utils.scale(44), marginTop: Utils.scale(Constant.isIOS ? 30 : 16), marginLeft: Utils.scale(16) }
            clearButtonStyle = { height: Utils.scale(44), marginTop: Utils.scale(Constant.isIOS ? 30 : 16), marginRight: Utils.scale(16) }
        }

        return (
            <View
                style={{
                    width: width,
                    height: height,
                    backgroundColor: 'white',
                    zIndex: 666,
                    elevation: 666,
                    position: 'absolute'
                }}
            >
                <View style={styles.topBar}>
                    <TouchableOpacity
                        onPress={() => this.onClose()}
                        style={closeButtonStyle}
                    >
                        <View style={styles.backView}>
                            <Image
                                resizeMode={'contain'}
                                style={{
                                    width: Utils.scale(22),
                                    height: Utils.scale(22)
                                }}
                                source={CloseIcon}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={clearButtonStyle}
                        onPress={() => this.onClear()}
                    >
                        <OText text='SEARCH_CLEAR' />
                    </TouchableOpacity>
                </View>

                {/* 输入框 */}
                {this.renderTextInput()}

                < ScrollView
                    keyboardShouldPersistTaps={'always'}
                    keyboardDismissMode={'on-drag'}
                    overScrollMode={'always'}
                    onScrollBeginDrag={() => {
                        this.refs.searchTextInput.refs.OTextInput.blur()
                    }}
                >
                    {this.renderList(this.state.searchList)}
                </ScrollView >
            </View >
        )
    }

    renderTextInput() {
        let { searchStore } = this.props;
        let keyword = searchStore.searchTextInputValue;
        // console.log('searchStore.searchTextInputValue:', keyword, keyword.length);
        if (searchStore.needSearchTextInput) {
            // console.log('使用Value属性')
            searchStore.needSearchKeyword && this.searchKeyword(keyword)

            return (
                <OTextInput
                    ref={'searchTextInput'}
                    layoutStyle={styles.textInputStyle}
                    placeholder={I18n('SEARCH_TEXT')}
                    returnKeyType='search'
                    maxLength={100}
                    onChangeText={(text) => {
                        // console.log(text, text.length);
                        searchStore.setSearchTextInputValue(text);
                        searchStore.setNeedSearchTextInput(false);
                        // this.setState({ keyword: text })

                        this.timer && clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.searchKeyword(text);
                        }, 300);
                    }}
                    onSubmitEditing={() => {
                        this.searchKeyword(keyword);
                    }}
                    value={keyword}
                />
            )
        } else {
            // console.log('不使用Value属性')
            return (
                <OTextInput
                    ref='searchTextInput'
                    layoutStyle={styles.textInputStyle}
                    placeholder={I18n('SEARCH_TEXT')}
                    returnKeyType='search'
                    maxLength={100}
                    onChangeText={(text) => {
                        // console.log(text, text.length);
                        searchStore.setSearchTextInputValue(text);
                        // this.setState({ keyword: text })

                        this.timer && clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.searchKeyword(text);
                        }, 300);

                        if (text === null || text === undefined || text.length === 0) {
                            this.onClear();
                        }
                    }}
                    onSubmitEditing={() => {
                        this.searchKeyword(keyword);
                    }}
                    defaultValue={keyword}
                />
            )
        }
    }

    showKeyboard(isShow = false) {
        try {
            if (isShow) {
                this.refs.searchTextInput.refs.OTextInput.focus()
            } else {
                this.refs.searchTextInput.refs.OTextInput.blur()
            }
        } catch (error) {
        }
    }

    searchKeyword(keyword) {
        // if (keyword.length < 2) {
        //     this.setState({
        //         searchList: [],
        //     })
        //     return;
        // }
        this.props.searchStore.searchTips(keyword, (resultList) => {
            this.props.searchStore.setNeedSearchKeyword(false);
            this.setState({
                searchList: resultList,
            })
        })
    }

    onClose() {
        this.props.onPressClose && this.props.onPressClose();
        this.onClear();
        this.refs.searchTextInput.setBlur();
    }

    onClear() {
        this.props.searchStore.setSearchTextInputValue('');
        this.refs.searchTextInput.setClear();
        this.setState({
            // keyword: '',
            searchList: []
        })
    }

    renderList(listData = []) {
        let highlightText = this.props.searchStore.searchTextInputValue;
        let highlightStyle = { fontSize: Utils.scaleFontSizeFunc(14), fontWeight: '800', color: Constant.blackText }
        let normalStyle = { fontSize: Utils.scaleFontSizeFunc(14), color: Constant.blackText }

        if (listData && listData.length > 0) {
            return (
                listData.map((itemData, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.cell}
                            onPress={() => this.openProductList(itemData, index)}
                        >
                            <TextHighlight
                                highlight={highlightText}
                                highlightStyle={highlightStyle}
                                style={normalStyle}
                            >
                                {itemData.source}
                            </TextHighlight>
                        </TouchableOpacity>
                    )
                })
            )
        } else {
            return null;
        }
    }

    openProductList(itemData, index) {
        this.onClose();

        if (this.props.refreshProductList) {
            this.props.refreshProductList(itemData);
        } else {
            this.props.searchStore.setSearchBorderValue(itemData.source);
            Actions.push('SearchProductList')
        }
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        margin: Utils.scale(16),
    },
    cell: {
        padding: Utils.scale(16),
        paddingTop: Utils.scale(14),
        paddingBottom: Utils.scale(14),
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})