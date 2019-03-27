import React, {Component} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import Utils from '../../utils/Utils';
import * as Constant from "../../utils/Constant"
import ArrowRight from '../../res/img/arrow_right.png';
import OText from '../OText/OText';
import IconPoint from '../../res/images/icon_point.png';

const { width } = Dimensions.get('window');

export default class AddressItem extends Component {

    //渲染
    render() {
       
        const {item,isDef, showArrow} = this.props;
        const {addressId, countryName, firstname, lastname, linkman, phone, address1, address2, city, stateCode, postcode} = item;

        let arrowView = showArrow ? <Image style={styles.arrowRight} source={ArrowRight} /> : null;
        let fullName = linkman ? linkman : firstname + " " + lastname;

        let phoneNum = Utils.formatPhoneUs(phone);

        return <View
            key={addressId}
            style={styles.wrap}
        >
            <View>
                <View style={{flexDirection:'row', alignItems: 'center', paddingBottom: Utils.scale(16),}}>
                    <Text numberOfLines={1} style={this.props.nameStyle ? this.props.nameStyle : styles.userName}>{fullName }</Text>
                    {isDef && <View style={styles.defaulView}>
                        <OText style={styles.befaulText} text={'ADDRESS_BOOK_DEFAUL'}/>
                    </View>}
                    
                </View>
                
                <Text numberOfLines={1}
                    style={styles.content}>{phoneNum}</Text>
                <Text numberOfLines={2} style={address1 && address1.includes("$") ? styles.contentWrong:styles.content}>{address1.replaceAll("\\$" ,'') + ', '}
                    {address2 ? <Text style={address2.includes("$") ? styles.contentWrong:styles.content}>{address2.replaceAll("\\$" ,'') + ', '}</Text>:null}
                    <Text style={city.includes("$") ? styles.contentWrong:styles.content}>{city.replaceAll("\\$" ,'')+ ', '}</Text>
                    <Text style={stateCode.includes("$") ? styles.contentWrong:styles.content}>{stateCode.replaceAll("\\$" ,'')+ ', '}</Text>
                    <Text style={postcode.includes("$") ? styles.contentWrong:styles.content}>{postcode.replaceAll("\\$" ,'')+ ', '}</Text>
                    <Text style={countryName.includes("$") ? styles.contentWrong:styles.content}>{countryName.replaceAll("\\$" ,'')}</Text>
                </Text>
                {this.renderTips(item)}
            </View>
            {arrowView}
        </View>
    }

    renderTips(item){
        let isPhoneUs = Utils.isPhoneUs(item.phone);

        return ( isPhoneUs?null:
                <View style={styles.bottomViewEnd}>
                    <Image style={{width:14,height:14}} source={IconPoint}/>
                    <OText
                        style={styles.infoText}
                        text={'ADDRESS.ADDRESS_PHONE_ERROR'}
                    />
                </View>
        )
    }
};

const styles = StyleSheet.create({
    wrap: {
        paddingTop: Utils.scale(10),
        paddingLeft: Utils.scale(16),
        paddingRight: Utils.scale(16),
        width: width,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    userName: {
        // width: '40%',
        fontSize: Utils.scaleFontSizeFunc(18),
        color: Constant.blackText,
        fontWeight: 'bold',
        paddingRight:Utils.scale(6),
    },
    defaulView:{
        height:Utils.scale(16),
        width:Utils.scale(38),
        borderRadius: Utils.scale(18),
        backgroundColor:Constant.themeText,
        justifyContent:'center',
        alignItems:'center',
        marginTop:Utils.scale(3)
    },
    befaulText:{
        
        color:'#FFF',
        fontSize:Utils.scale(10)
    },
    content: {
        width:Utils.scale(300),
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.grayText,
        marginBottom: Utils.scale(8),
    },
    contentWrong: {
        fontSize: Utils.scaleFontSizeFunc(14),
        color: Constant.themeText,
        marginBottom: Utils.scale(8),
    },
    arrowRight: {
        width: Utils.scale(14),
        height: Utils.scale(14),
        position: 'absolute',
        right: Utils.scale(16),
        top: Utils.scale(60)
    },
    bottomViewEnd: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    infoText: {
        color: Constant.themeText,
        fontSize: Utils.scaleFontSizeFunc(12),
        marginLeft:5,
        marginTop:1
    },
});




