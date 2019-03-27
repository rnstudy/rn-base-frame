import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity,
    Platform,
    Text
} from 'react-native';

import Utils from '../../utils/Utils';
import { Actions } from 'react-native-router-flux';
import * as Constant from "../../utils/Constant"
import LOG_ICON from '../../res/img/logistics_icon.png';
import BoldLine from "../BoldLine/BoldLine";
import ArrowRight from '../../res/img/arrow_right.png';
import OText from '../../component/OText/OText';
import i18n from "../../config/i18n";
import { toJS } from '../../../node_modules/mobx';

export default class OrderLogisticsComponent extends Component {

    render() {
        try{
            const { logisticsInfo, logisticsData } = this.props;
            return <View>
                <OText text={'ORDERDETAIL.TEXT_TRACK'} style={styles.addressTitle} />
                {
                    logisticsInfo.map((item,index) =>{
                        return <TouchableOpacity key={index} onPress={() => Actions.TrackTrace( logisticsData[index] )}>
                            <View style={styles.viewStyle}>
                                <View style={styles.circleStyle}>
                                    <View style={{flexDirection: 'row', }}>
                                        <Image style={{width:Utils.scale(40), height:Utils.scale(40)}} source={LOG_ICON} />
                                        {item &&
                                            this.renderInfo(item)
                                        }
                                    </View>
                                    <Image source={ArrowRight} />
                                </View>
                                
                            </View>
                        </TouchableOpacity>
                    })
                }
                
            </View>
        }catch(err){
            console.log('OrderLogisticsComponen',err);
            return <View></View>
        }
        
    }

    renderInfo(item) {
        try {
            return (
                    <View style={styles.descView}>   
                        {item.lastestLogisticsEvent && item.lastestLogisticsEvent.StatusDescription ?
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.dateText}>{item.lastestLogisticsEvent.StatusDescription}</Text> :
                                <Text style={styles.dateText}>{item.orderTrackId}</Text>
                        }
                        {item.lastestLogisticsEvent && item.lastestLogisticsEvent.Date ?
                            <Text style={styles.descText} numberOfLines={2}>{item.lastestLogisticsEvent.Date}</Text> :
                            <Text style={styles.descText} numberOfLines={2}>{item.logisticsType}</Text>
                        }
                    </View>
                
            )
        } catch (error) {
            return <View />
        }

    }
}

const styles = StyleSheet.create({
    addressTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: Constant.blackText,
        marginLeft: Constant.marginLeft,
        marginTop: Constant.marginLeft,
        marginBottom:Utils.scale(18),
    },
    viewStyle: {
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
    },
    circleStyle: {
        height: Utils.scale(60),
        flexDirection: 'row',
        justifyContent: 'space-between',
        //backgroundColor: Constant.boldLine,
        alignItems: 'center',
        backgroundColor: Constant.boldLine,
        borderRadius:Utils.scale(8),
        //marginTop:Utils.scale(18),
        paddingLeft:Utils.scale(16),
        paddingRight:Utils.scale(16),
    },
    descView: {
        flexDirection:'column',
        //alignItems:'center',
        marginLeft: Utils.scale(16),
    },
    dateText: {
        width:Utils.scale(230),
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.greenText,
        paddingRight:Utils.scale(16),
    },
    descText: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.lightText,
    },
    
});
