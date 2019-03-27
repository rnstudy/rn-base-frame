import React, {Component} from 'react';
import {TouchableOpacity, Image, StyleSheet, Text, View} from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import ArrowRight from '../../res/images/enter.png';

export default class ImageHeadList extends Component {
    render() {
        // const {headUri} = this.props;
        // console.log('|||||ImageHeadList',this.props);
       
        return(
           
                <TouchableOpacity
                    onPress={() => this.props.onPress && this.props.onPress()}
                    activeOpacity={1}
                >
                <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}}>
                    <View style={styles.headerContent}>
                        <View >
                            <Image style={ this.props.grayImgSty ? 
                                [styles.portrait,this.props.headSize,styles.grayImgChooseSty] : 
                                [styles.portrait,this.props.headSize]} 
                                source={this.props.headUri} 
                                />
                            
                        </View>
                        
                        <View style={styles.userText}>
                            <Text style={this.props.grayImgSty ? 
                            [styles.nickname,this.props.topTextSty,styles.grayText]:
                            [styles.nickname,this.props.topTextSty]}
                            >{this.props.topText}</Text>
                            <Text style={styles.userId}>{this.props.subText}</Text>
                            {/* <Text style={styles.email}>{shopkeeperInfo.email}</Text> */}
                        </View>
                    </View>
                    <View style={{justifyContent:'center'}}>
                        {this.props.showArrow ? 
                        < Image style = {styles.ImageSty}
                        source = {ArrowRight}
                        /> : null }
                        {this.props.rightText ? <View >
                            <Text style={{fontSize:Utils.scale(14)}}>{'+'}{this.props.unit}{this.props.rightText}</Text>
                        </View> : null}
                    </View>
                    
                </View>
                    
                    
                </TouchableOpacity>

        )
    }
};
const styles = StyleSheet.create({
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // paddingRight: 0,
    },
    grayImgChooseSty:{
        opacity:0.5,
        backgroundColor:'rgba(0,0,0,0.5)',
    },
    portrait: {
        //backgroundColor:'rgba(0,0,0,1)',
        
        borderRadius: Utils.scale(25),
    },
    userText: {
        //marginTop:Utils.scale(7),
        justifyContent:'center',
        marginLeft:Utils.scale(12),
        //marginBottom: Utils.scale(29),
    },
    nickname: {
        fontSize: Utils.scale(16),
        color: Constant.blackText,
    },
    grayText:{
        color: Constant.lightText,
    },
    userId:{
        fontSize: Utils.scale(12),
        color: Constant.lightText,
        paddingTop: Utils.scale(6),  
    },
    ImageSty:{
        width: Utils.scale(14),
        height: Utils.scale(14),
        marginRight: Utils.scale(16)
    }
})
