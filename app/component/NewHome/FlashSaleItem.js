import React, { Component } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    InteractionManager
} from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from "../OText/OText";
import I18n from "../../config/i18n";
import { Actions } from "react-native-router-flux";
import { toJS } from 'mobx';
const { width, height } = Dimensions.get("window");
import { inject, observer } from "mobx-react/native";
import LEFT_ICON from '../../res/images/left.png';
import RIGHT_ICON from '../../res/images/right.png';
import ListGallery from '../../component/ListGallery';

const SCROLL_OFFSET = 10

@inject(stores => ({
    homeStore: stores.homeStore,
}))
@observer
export default class FlashSaleItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollPageIndex: 0
        };
    }


    componentWillMount() {
        this.scrollStar = null
        this.scrollEnd = null
    }

    pressItem(item) {
        if (this.props.pressItem) {
            this.props.pressItem()
        } else {
            const { spId } = item;
            Actions.push('FlashSpecial', { spId })
        }
    }

    //渲染
    render() {
        const { flashSpecialData } = this.props.homeStore
        if (flashSpecialData && flashSpecialData.length > 0) {
            return (<View style={{
                marginBottom: Utils.scale(13)
            }}
            >
                <View style={styles.titleView}>
                    <Text style={styles.textTitle}>{I18n('INDEX.TEXT_TRENDS')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            if (this.state.scrollPageIndex > 0) {
                                let temp = this.state.scrollPageIndex - 1;
                                this.scrollFlatList(temp)
                            }
                        }}>
                            <Image
                                style={styles.touchImage}
                                source={LEFT_ICON}
                            />
                        </TouchableOpacity>
                        <Text style={styles.touchText}>{this.state.scrollPageIndex + 1}/{flashSpecialData.length}</Text>
                        <TouchableOpacity onPress={() => {
                            if (this.state.scrollPageIndex < (flashSpecialData.length - 1)) {
                                let temp = this.state.scrollPageIndex + 1
                                this.scrollFlatList(temp)
                            }
                        }}>
                            <Image
                                style={styles.touchImage}
                                source={RIGHT_ICON}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <ListGallery
                    listData={flashSpecialData}
                    ref={'ListGallery'}
                    renderItem={(item, index) => this.renderFlashItem(item, index)}
                    headFootComponent={<View style={{ width: Utils.scale(12), height: 10 }} />}
                    separatorComponent={<View style={{ width: Utils.scale(8), height: 10 }} />}
                    scrollPageIndex={this.state.scrollPageIndex}
                    scrollPageIndexFun={(tempIndex) => this.setState({
                        scrollPageIndex: tempIndex
                    })}
                    listStyle={{ width: width, height: Utils.scale(165) }}
                    viewOffset={4}
                />
            </View>
            )
        } else {
            return <View />
        }
    }


    scrollFlatList(tempIndex) {
        this.refs.ListGallery.scrollFlatList(tempIndex)
    }

    renderFlashItem(item, ) {
        const {
            spBannerImgCn,
        } = item;
        return (
            <TouchableOpacity
                onPress={() => this.pressItem(item)}
                activeOpacity={1}
            >
                <Image
                    source={{ uri: spBannerImgCn || '' }}
                    style={styles.flashSellImg}
                />
            </TouchableOpacity>
        )
    }
};

const styles = StyleSheet.create({
    bannerIndex: {
        width: width,
        height: Utils.scale(180),
        marginBottom: Utils.scale(20),
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: Utils.scale(18),
    },
    titleView: {
        marginTop: Utils.scale(21),
        paddingRight: Utils.scale(16),
        paddingLeft: Utils.scale(16),
        marginBottom: Utils.scale(13),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textTitle: {
        color: Constant.blackText,
        fontSize: Utils.scaleFontSizeFunc(18),
        fontWeight: 'bold',
    },
    flashSellImg: {
        width: Utils.scale(343),
        height: Utils.scale(160),
        borderRadius: Utils.scale(4),
    },
    touchImage: {
        width: Utils.scale(20),
        height: Utils.scale(20),
    },
    touchText: {
        marginLeft: Utils.scale(10),
        marginRight: Utils.scale(10),
        color: Constant.grayText,
        fontSize: Utils.scaleFontSizeFunc(14),
    }
});




