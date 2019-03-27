import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import Utils from "../../utils/Utils";
import Screen from '../../utils/Screen'
import OText from '../../component/OText/OText';

import RightArrow from '../../res/images/enter.png'

export default class PointCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { props } = this;
        const { propsStyle ,arrow } = props;
        return (
            <View
                style={[styles.background, propsStyle]}
                
            >   
                <View style={{flexDirection:'column',alignItems: 'flex-start',}}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={styles.earning}>{props.text || '0.00'}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={styles.subtitle}>{props.pendingTitle}</Text>
                            <Text style={styles.subnum}>{props.pending || '0.00'}</Text>
                        </View>
                        <View style={{marginLeft:Utils.scale(109)}}>
                            <Text style={styles.subtitle}>{props.cumulativeTitle}</Text>
                            <Text style={styles.subnum}>{props.cumulative || '0.00'}</Text>
                        </View>
                    </View> 
                </View>

                <View style={{alignItems:'center',}}>
                    {arrow === true ? <Image style={{width:Utils.scale(14),height:Utils.scale(14)}} source={RightArrow} /> : null}
                    
                </View>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#FD5F10',
        height:Utils.scale(138),
        borderRadius: Utils.scale(12),
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingLeft: Utils.scale(20),
        paddingRight: Utils.scale(16),
        paddingBottom: Utils.scale(20),
        paddingTop: Utils.scale(20),
    },
    
    title: {
        fontSize: Utils.scale(12),
        color: '#FFFFFF',
        textAlign: 'center',
    },
    earning: {
        fontSize: Utils.scale(28),
        fontWeight: 'bold',
        color: '#FFD6C2',
        textAlign: 'center',
        paddingTop: Utils.scale(8),
    },
    subtitle:{
        fontSize: Utils.scale(12),
        color: '#FFFFFF',
        paddingTop: Utils.scale(12),
    },
    subnum:{
        fontSize: Utils.scale(12),
        color: '#FFD6C2',
        paddingTop: Utils.scale(4)
    },
    subDiv: {
        flex: 3,
        flexDirection: 'row',
        paddingTop: Utils.scale(30),
        alignItems: 'center',
    },
    subTitle: {
        fontSize: 10,
        color: '#FFF',
        textAlign: 'center',
        // flex: 1,
    },
    subContent: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        // flex: 1,
    },
    line: {
        width: 1,
        height: Utils.scale(30),
        backgroundColor: '#FF6868',
    }
});