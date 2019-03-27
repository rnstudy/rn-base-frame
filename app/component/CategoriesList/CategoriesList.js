import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import CommonHeader from '../../component/Header/CommonHeader';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import SelectImage from '../../../app/res/img/categories_selected.png'
import { toJS } from 'mobx';
import I18n from '../../config/i18n'

export default class CategoriesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentLevel: 1,
            selectCategory: null,
        };
    }

    // resetLevel(dataList, level) {
    //     let listData = [];
    //     dataList.map((item, index) => {
    //         item.level = level;
    //         listData.push(item);
    //     })
    //     return listData;
    // }

    updateFun() {
        this.forceUpdate()
    }

    render() {
        try {
            const { listData, pressAll } = this.props;
            // console.log('listData------------', toJS(listData))
            let cellList = [];
            listData.map((obj, index) => {
                cellList.push(this.renderCell(obj, index))
            })
            const AllObj = {
                categoryName: I18n('TEXT_ALL_CATEGORIES'),
                categoryType: 1
            }
            return (
                <ScrollView>
                    {this.renderCell(AllObj, 0, () => {
                        pressAll();
                    })}
                    {cellList}
                </ScrollView>
            )
        } catch (error) {
            console.log('----error--', error);
            return <View />
        }
    }

    renderCell(item, index, pressAll = null) {
        const { selectCategory } = this.props;
        const { categoryId, categoryType } = item;
        const level = categoryType - 1;
        let isExpand = false;
        let isSelect = false;
        let titleBold = null;
        let childSell = [];
        try {
            const temp = selectCategory[level];
            const currentCategory = selectCategory && selectCategory.length > 0 ? selectCategory[selectCategory.length - 1] : null;
            isExpand = categoryId === temp.categoryId;
            isSelect = categoryId === currentCategory.categoryId;
            titleBold = isSelect ? { fontWeight: 'bold' } : null;
        } catch (error) {
        }
        if (isExpand && item.items && item.items.length > 0) {
            const childItems = item.items;
            childItems.map((obj, i) => {
                childSell.push(this.renderCell(obj, i))
            })
        }
        const leftMargin = { marginLeft: Utils.scale((level + 1) * 16) };

        let backText = item.categoryName;
        // if (level === 2 && index === 0) {
        //     backText = '<<' + backText;
        // } else if (level === 3) {
        //     if (index === 0 || index === 1) {
        //         backText = '<<' + backText;
        //     }
        // }
        return (
            <View key={categoryId}>
                <TouchableOpacity
                    style={styles.cellBg}
                    onPress={() => {
                        const { pressItem } = this.props;
                        pressItem(item, index, () => this.updateFun());
                        // if (pressAll) {
                        //     pressAll()
                        // } else {
                        //     const { pressItem } = this.props;
                        //     pressItem(item, index, () => this.updateFun());
                        // }
                    }}
                >
                    <Text style={[styles.selectTitle, leftMargin, titleBold]}>{backText}</Text>
                    {isSelect ? <Image style={styles.select} source={SelectImage} /> : <View style={styles.select} />}
                </TouchableOpacity>
                <View style={styles.line} />
                {childSell}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    cellBg: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Utils.scale(48),
        justifyContent: 'space-between',
    },
    selectTitle: {
        fontSize: Utils.scale(14),
        color: Constant.blackText,
    },
    unSelectTitle: {
        fontSize: Utils.scale(14),
        color: Constant.blackText,
        height: Utils.scale(48),
    },
    select: {
        width: Utils.scale(12),
        height: Utils.scale(8),
        marginRight: Constant.marginLeft,
    },
    line: {
        height: 1,
        backgroundColor: '#E5E5E5',
    },
});