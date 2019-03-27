import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
    Text,
    Image,
    View,
    StyleSheet
} from 'react-native';
import * as Constant from "../../utils/Constant";
import OText from '../OText/OText'
import Utils from '../../utils/Utils';

import OCT_SEL from '../../res/img/tab_oct_sel.png';
import HOME_UNSEL from '../../res/img/tab_discover_unsel.png';
import HOME_SEL from '../../res/img/tab_discover_sel.png';

import STORE_UNSEL from '../../res/img/tab_store_unsel.png';
import STORE_SEL from '../../res/img/tab_store_sel.png';

import SOLD_UNSEL from '../../res/img/tab_sold_unsel.png';
import SOLD_SEL from '../../res/img/tab_sold_sel.png';

import CART_UNSEL from '../../res/img/tab_cart_unsel.png';
import CART_SEL from '../../res/img/tab_cart_sel.png';

import ACCOUNT_UNSEL from '../../res/img/tab_account_unsel.png';
import ACCOUNT_SEL from '../../res/img/tab_account_sel.png';

const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
};

import { inject, observer } from 'mobx-react/native';

@inject(stores => ({
    shopCartStore: stores.shopCartStore,
}))
@observer
export default class TabIcon extends Component {
    render() {
        let view = null;
        const { props } = this;
        const { title, focused } = props;
        let img = null;
        let showText = true;
        let imageStyle = { width: 32, height: 32 }
        switch (title) {
            case 'FOOTER_INDEX':
                img = focused ? HOME_SEL : HOME_UNSEL;
                break;
            case 'FOOTER_MY_STORE':
                img = focused ? OCT_SEL : STORE_UNSEL;
                showText = !focused;
                imageStyle = focused ? { width: 45, height: 45 } : imageStyle
                break;
            case 'FOOTER_SOLD':
                img = focused ? SOLD_SEL : SOLD_UNSEL;
                break;
            case 'STORE_SALE_LIST_CART':
                img = focused ? CART_SEL : CART_UNSEL;
                if (this.props.shopCartStore.getProductLength) {
                    view = <View style={styles.cartCount}>
                        <Text style={styles.cartCountText}>{this.props.shopCartStore.getProductLength}</Text>
                    </View>
                }
                break;
            case 'FOOTER_ACCOUNT':
                img = focused ? ACCOUNT_SEL : ACCOUNT_UNSEL;
                break;

            default:
                break;
        }
        return <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <Image
                source={img}
                style={imageStyle}
            />
            {showText && <OText
                style={{
                    color: props.focused ? Constant.themeText : "#8e8e93",
                    fontSize: 10
                }}
                text={props.title}
            />}
            {!focused && view}
        </View>
    }

}
const styles = StyleSheet.create({
    cartCount: {
        width: Utils.scale(20),
        height: Utils.scale(20),
        borderRadius: Utils.scale(10),
        backgroundColor: Constant.themeText,
        right: 0,
        top: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartCountText: {
        fontSize: Utils.scaleFontSizeFunc(10),
        color: 'white',
    },
})
