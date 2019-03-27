import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, DeviceEventEmitter } from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import OText from "../OText/OText";
import I18n from "../../config/i18n";
import { Actions } from "react-native-router-flux";
import { toJS } from 'mobx';
import HomeItem from '../../component/HomeItem/HomeItem';
import HorizontalItem from '../../component/HomeItem/HorizontalItem';
import SpecialListCount from '../../component/HomeItem/SpecialListCount';
import moment from 'moment';
import { inject, observer } from "mobx-react/native";

@inject(stores => ({
    homeStore: stores.homeStore,
}))
@observer
export default class SingleSpecial extends Component {

    constructor(props) {
        super(props);
        this.state = {
            horItem: false,
        };
    }


    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    //渲染
    render() {
        const { specialListId, specialList, unit } = this.props.homeStore;
        const { horItem } = this.state;
        if (specialList[specialListId] && specialList[specialListId].items && specialList[specialListId].items.length > 0) {
            const { items, countTime } = specialList[specialListId];
            const time = moment(toJS(countTime)).unix();
            return (<View style={styles.container}>
                <SpecialListCount
                    countTime={toJS(time)}
                    horItem={this.state.horItem}
                    changeItemType={() => this.setState({ horItem: !this.state.horItem })}
                />
                {items.map((obj, index) => {
                    return horItem ? <HorizontalItem
                        item={obj}
                        key={index}
                        unit={unit}
                    /> : <HomeItem
                            item={obj}
                            key={index}
                            unit={unit}
                        />
                })}
            </View>
            )
        } else {
            return <View />
        }
    }
};

const styles = StyleSheet.create({

});




