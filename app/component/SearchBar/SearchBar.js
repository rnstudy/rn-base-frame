import React, { Component } from 'react';
import { Alert, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommonHeader from '../../component/Header/CommonHeader';
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
import OTextInput from '../../component/OTextInput/OTextInput'
import SearchPage from './SearchPage'

const { width, height } = Dimensions.get('window');

export default class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showBackIcon: props.showBackIcon ? true : false,
            showRightView: props.showRightView ? true : false,
            showSearchPage: false,
        }
    }

    render() {
        const { showBackIcon, showRightView, showSearchPage } = this.state;

        // 设置搜索框
        let borderWidth = width - Utils.scale(32);
        let newStyle = { width: borderWidth, marginLeft: Utils.scale(16) }
        if (showBackIcon && showRightView) {// 显示返回按钮和右按钮
            borderWidth = width - Utils.scale(95);
            newStyle = { width: borderWidth }
        } else if (showBackIcon) {// 显示返回按钮
            borderWidth = width - Utils.scale(65);
            newStyle = { width: borderWidth }
        } else if (showRightView) {// 显示右按钮
            borderWidth = width - Utils.scale(66);
            newStyle = { width: borderWidth, marginLeft: Utils.scale(16) }
        } else {
            // 只显示搜索框
        }

        return (
            <View style={styles.bgView}>
                {/* 返回 */}
                {showBackIcon &&
                    <TouchableOpacity
                        style={[styles.backView, { marginLeft: Utils.scale(4) }]}
                        onPress={() => this.onPressBack()}
                    >
                        <Image
                            style={styles.backIcon}
                            resizeMode={'contain'}
                            source={BackIcon}
                        />
                    </TouchableOpacity>
                }

                {/* 搜索框 */}
                <TouchableOpacity
                    style={[styles.border, newStyle]}
                    activeOpacity={1}
                    onPress={() => this.onOpenSearchPage()}
                >
                    <Image
                        resizeMode={'contain'}
                        source={Magnifier}
                    />
                    <Text style={styles.inputView}>{this.props.keyword ? this.props.keyword : I18n('SEARCH_TEXT')}</Text>
                </TouchableOpacity>

                {/* 右视图 */}
                {showRightView &&
                    <TouchableOpacity
                        style={[styles.backView, { marginRight: Utils.scale(4) }]}
                    >
                        <Image
                            style={styles.backIcon}
                            resizeMode={'contain'}
                            source={MenuIcon}
                        />
                    </TouchableOpacity>
                }
            </View>
        )
    }

    onPressBack() {
        this.props.backAction ? this.props.backAction() : Actions.pop()
    }

    onOpenSearchPage() {
        this.props.onPress(true)
    }
}

const styles = StyleSheet.create({
    bgView: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        height: Utils.scale(44),
        flexDirection: 'row',
        alignItems: 'center',

    },
    backView: {
        width: Utils.scale(44),
        height: Utils.scale(44),
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        width: Utils.scale(22),
        height: Utils.scale(22),
    },
    border: {
        height: Utils.scale(38),
        backgroundColor: Constant.boldLine,
        borderRadius: Utils.scale(22),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: Utils.scale(14),
    },
    inputView: {
        marginLeft: Utils.scale(12),
        fontSize: Utils.scaleFontSizeFunc(16),
        color: Constant.lightText,
    }
});