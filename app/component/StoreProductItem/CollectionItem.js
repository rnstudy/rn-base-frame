import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from "../OText/OText";
import ArrowRight from '../../res/img/arrow_right.png';
import COLLECT_BG from '../../res/img/store_collect_bg.png';
import { Actions } from "react-native-router-flux";
import I18n from "../../config/i18n";
import SkipView from '../../component/StoreProductItem/SkipView';
import LIST_EMPTY from '../../res/img/oops_list_empty.png'

import { inject, observer } from 'mobx-react/native';
@inject(stores => ({
    collectionStore: stores.collectionStore,
}))
@observer
export default class CollectionItem extends Component {

    componentDidMount() {
        this.queryCollections();
    }

    pressItem(collectionId) {
        Actions.push('CollectionEdit', { collectionId: collectionId })
    }

    //渲染
    render() {
        let contentView = null;
        try {
            const { listData } = this.props.collectionStore;
            if (listData && listData.length > 0) {
                contentView = this.renderList();
            } else {
                contentView = this.renderEmpty();
            }
        } catch (error) { }

        return (
            <View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => this.pressTitle()}>
                    <View style={styles.layRow}>
                        <OText
                            text={'STORE_MANAGE_COLLECTION_TITLE'}
                            style={styles.textTitle}
                        />
                        <Image style={styles.arrowRight} source={ArrowRight} />
                    </View>
                </TouchableOpacity>
                {

                }
                {contentView}
                <SkipView />
            </View>
        )
    }

    renderList() {
        try {
            const { listData } = this.props.collectionStore;
            if (listData && listData.length > 0) {
                return (
                    <FlatList
                        data={listData}
                        renderItem={({ item }) => this.renderItem(item)}
                        horizontal={true}
                        style={{ paddingLeft: 4 }}
                    />
                )
            }
        } catch (error) { }

        return (
            <View />
        )
    }

    renderItem(item) {
        const { collectionId, productPic, collectionName } = item;
        return (
            <TouchableOpacity
                onPress={() => this.pressItem(collectionId)}
            >
                <View
                    style={styles.itemStyle}
                >
                    <View style={{ justifyContent: 'center', backgroundColor: 'transparent' ,alignItems:'center'}}>
                        <Image
                            source={{ uri: productPic }}
                            style={styles.flashSellImg}
                        />
                        <Image source={COLLECT_BG} />
                    </View>

                    <Text
                        style={styles.info}
                        numberOfLines={2}
                    >{collectionName}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderEmpty() {
        return (
            <View style={styles.defaultImage}>
                <Image source={LIST_EMPTY} />
                <OText
                    style={styles.nothingText}
                    text={'COLLECTION_LIST_EMPTY1'}
                />
                <TouchableOpacity onPress={() => this.pressAddCollection()}>
                    <OText
                        style={styles.addCollectionText}
                        text={'COLLECTION_LIST_EMPTY2'}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    pressTitle() {
        Actions.push('CollectionList', { isEdit: true })
    }

    pressAddCollection() {
        Actions.push('CollectionEdit', { callback: () => this.queryCollections() })
    }

    queryCollections() {
        this.props.collectionStore.queryCollections()
    }
};

const styles = StyleSheet.create({
    itemStyle: {
        paddingLeft: Utils.scale(12),
        paddingBottom: Utils.scale(20),
        width: Utils.scale(272),
        backgroundColor: 'transparent'
    },
    textTitle: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(24),
        fontWeight: 'bold',
        marginLeft: Utils.scale(16),
    },
    layPrice: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    layRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Utils.scale(20),
        marginBottom: Utils.scale(16)
    },
    arrowRight: {
        width: Utils.scale(14),
        height: Utils.scale(14),
        marginRight: Utils.scale(16)
    },
    flashSellImg: {
        width: Utils.scale(260),
        height: Utils.scale(260),
        borderRadius: Utils.scale(12),
        backgroundColor: 'transparent'
    },
    info: {
        width: Utils.scale(260),
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(16),
        textAlign: 'center'
    },
    defaultImage: {
        width: '100%',
        // height: '100%',
        height: Utils.scale(300),
        alignItems: 'center',
        justifyContent: 'center',
    },
    nothingText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.grayText,
        paddingTop: Utils.scale(20),
    },
    addCollectionText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: '#ff4081',
        paddingTop: Utils.scale(40),
    }
});




