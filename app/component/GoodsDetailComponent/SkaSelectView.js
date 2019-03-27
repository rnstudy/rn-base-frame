import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import OText from '../../component/OText/OText';

import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import TRUE_ICON from '../../res/img/detail_true.png';

export default class SkaSelectView extends Component {

    //构造函数
    constructor(props) {
        super(props);
    }

    filterSka() {
        let skaObj = null;
        let skaIndex = 0;
        const { attributeList } = this.props;
        if (attributeList && attributeList.length > 0) {
            for (const listIndex in attributeList) {
                const { isSka } = attributeList[listIndex];
                if (isSka) {
                    skaObj = attributeList[listIndex];
                    skaIndex = listIndex
                }
            }
        }
        return { skaObj, skaIndex }
    }

    //渲染
    render() {
        const filterObj = this.filterSka();
        const { skaObj, skaIndex } = filterObj;
        const { productId, changeAttr } = this.props;
        if (skaObj) {
            const { valueItems } = skaObj;
            if (valueItems && valueItems.length > 1) {
                return <ScrollView
                    horizontal={true}
                    style={styles.scrollViewStyle}
                >
                    {valueItems.map((obj, index) => {
                        let touchS = styles.touchStyle;
                        if (obj.productId === productId) {
                            touchS = [styles.touchStyle, {
                                borderWidth: Utils.scale(4),
                                borderColor: Constant.themeText,
                            }]
                        }
                        const { thumb, productUrl } = obj;

                        const url = thumb + '' !== '' ? thumb : productUrl;
                        return <TouchableOpacity
                            key={index}
                            onPress={() => changeAttr && changeAttr(obj, skaIndex)}
                            style={touchS}
                        >
                            <Image
                                style={styles.imageStyle}
                                source={{ uri: url }}
                            />
                        </TouchableOpacity>
                    })}
                </ScrollView>
            }
        }
        return <View>

        </View>
    }
};

const styles = StyleSheet.create({
    scrollViewStyle: {
        width: '100%',
        height: Utils.scale(48),
        marginLeft: Constant.marginLeft,
        // marginRight: Constant.marginLeft,
    },
    touchStyle: {
        width: Utils.scale(40),
        height: Utils.scale(40),
        borderRadius: Utils.scale(6),
        marginRight: Utils.scale(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle: {
        width: Utils.scale(36),
        height: Utils.scale(36),
        borderRadius: Utils.scale(6),
    },

});
