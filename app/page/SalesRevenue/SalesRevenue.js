import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    DeviceEventEmitter,
    InteractionManager
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { inject, observer } from "mobx-react/native";

import * as Constant from '../../utils/Constant';
import Utils from '../../utils/Utils';
import I18n from '../../config/i18n';

import PointCard from '../../component/PointCard/PointCard';
import CommonHeader from '../../component/Header/CommonHeader';
import OText from '../../component/OText/OText';
import MoreTitleList from '../../component/TittleList/MoreTitleList';
import BoldLine from "../../component/BoldLine/BoldLine"


const tempSelect = [
    {title:'SALEORDER.STORE_SALE_INCOME_DAY',selectkey:'day'},
    {title:'SALEORDER.STORE_SALE_INCOME_WEEK',selectkey:'week'},
    {title:'SALEORDER.STORE_SALE_INCOME_MONTH',selectkey:'month'},
    {title:'SALEORDER.STORE_SALE_INCOME_ALL',selectkey:'total'},
]

@inject(stores => ({
    user: stores.user,
}))
@observer
export default class SalesRevenue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            commission: 0,
            orders: 0,
            unit: "",
            selectIndex:0,
            refreshing:false,
        }
    }

    componentWillMount() {
        this.onRefresh()
    }
    onRefresh(){
        this.props.user.getSalesDetails(() => this.onTempSelect('day', 0));
        this.props.user.getTeamCommission();
        
    }
    render() {
        return (
            <CommonHeader
            title={I18n("SALEORDER.STORE_SALE_ORDERS_TITLE")}
            >   
                <ScrollView 
                style={styles.scroll}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                        tintColor={Constant.themeText}
                    />
                }
                >
                    <View >
                        {this.renderView()}
                    </View>  
                </ScrollView>
                 
            </CommonHeader>
        )
    }
    renderView(){
        const { commissionAndPoint } = this.props.user;
        const { totalCommission, balanceCommission, pendingCommission, currencyType, unit } = commissionAndPoint;
        let title = I18n('SALEORDER.STORE_PERSONAL_BALANCE',{unit:'$'});
        let pendingTitle = I18n('SALEORDER.STORE_PERSONAL_PENDING');
        let cumulativeTitle = I18n('SALEORDER.TEXT_CUMULATIVE')
        let text = unit + balanceCommission;
        let pending = pendingCommission;
        let cumulative = totalCommission;
        let bgStyle = { 
            backgroundColor: Constant.blackText,  
            marginTop:Utils.scale(24),
            marginBottom:Utils.scale(20),
            marginLeft:Utils.scale(11),
            marginRight:Utils.scale(11),
        };
        try{
            return (
                <View style={{backgroundColor:'#FFF'}}>
                    {/* Balamce框 */}
                    <View>
                        <TouchableOpacity
                        onPress={() => this.onPressWallet()}
                        activeOpacity={1}
                        >
                            <PointCard
                            title={title}
                            pendingTitle={pendingTitle}
                            cumulativeTitle={cumulativeTitle}
                            propsStyle={bgStyle}
                            text={text}
                            pending={pending}
                            cumulative={cumulative}
                            arrow={true}
                        />
                        </TouchableOpacity>
                    </View>

                    {/* 订单收益 */}
                    {this.rendSaleDetail()}

                    <View style={{height:Utils.scale(1),backgroundColor:Constant.boldLine,}}></View>
                    
                    {/* 订单销售明细 */}

                    {this.renderOrderSale()}
                    <BoldLine/>

                    {/* 团队收益 */}
                    {this.teamEarn()}
                </View>
                

            )
        }catch(err){
            return <View/>
        }
    }
    onPressWallet(){
        Actions.push('WalletList');
    }
    rendSaleDetail(){
        const { salesDetails } = this.props.user;
        const {unit } = salesDetails;
        return(
            <View  style={styles.common}>
                <View style={{paddingBottom:Utils.scale(20)}}>
                    <OText text={'SALEORDER.STORE_ORDER_BENEFIT'} style={{fontSize:Utils.scale(17), fontWeight:'bold' }}></OText>
                </View>

                <View>
                    {this.selectTab()}
                </View>

                <View style={{marginTop:Utils.scale(19)}}>
                    <View style={styles.textLayout}>
                        <OText style={{fontSize:Utils.scale(14)}} text={'SALEORDER.STORE_ORDERDETAIL_EARNINGS'}>{'('}{unit}{')'}</OText>
                        <Text style={{fontWeight:'bold',color:Constant.themeText}}>{'+'}{this.state.commission}</Text>
                    </View>
                    <View style={styles.textLayout}>
                        <OText style={{fontSize:Utils.scale(14)}} text={'SALEORDER.STORE_PERSONAL_ORDERS'}></OText>
                            <Text style={{fontWeight:'bold'}}>{this.state.orders}</Text>
                    </View>
                    <View style={styles.textLayout}>
                        <OText style={{fontSize:Utils.scale(14)}} text={'SALEORDER.STORE_PERSONAL_REVENUE'}>{'('}{unit}{')'}</OText>
                        <Text style={{fontWeight:'bold'}}>{this.state.amount}</Text>
                    </View>
                </View>
            </View>
        )
    }
    selectTab(){
        //let delectBorderRight = tempSelect
        

        return(
            <View style={styles.tabBoder}>
                {tempSelect.map((obj,index) => {
                    let viewStyle=styles.tabSelectSty ;
                    if(index+''=='0'){
                        viewStyle=[viewStyle,{borderTopLeftRadius: Utils.scale(16), borderBottomLeftRadius: Utils.scale(16),}]
                    }
                    if(index+''=='3'){
                        viewStyle=[viewStyle,{borderWidth: null,borderTopRightRadius: Utils.scale(16), borderBottomRightRadius: Utils.scale(16),}]
                    }
                    let selectSty = index + '' === this.state.selectIndex + '' ? viewStyle : null;

                    let borderRight = null;
                    if(index+'' !=='3' ){
                        borderRight= {borderRightWidth: Utils.scale(1),borderColor: Constant.blackText,}
                    }
                    return <TouchableOpacity
                                onPress={() => this.onTempSelect(obj.selectkey, index)}
                                style={[styles.allTabSty, selectSty, borderRight]}
                                key={index}
                            >
                                <View>
                                    <OText style={index + '' === this.state.selectIndex + '' ? {color:'#FFF'} : null} text={obj.title}></OText>
                                </View>  
                            </TouchableOpacity>
                })}
            </View>

        )
    }

    onTempSelect(select, index){
        const { salesDetails } = this.props.user;
        const {saleData } = salesDetails;
        //const {total, month, day, week} = salesDetails;
        //console.log(select,salesDetails[select])
        console.log(select,index);
        this.setState({
            amount: saleData[select].amount,
            commission: saleData[select].commission,
            orders: saleData[select].orders,
            selectIndex: index,
        })
    }

    renderOrderSale(){
        return(
            < MoreTitleList
                title={I18n('SALEORDER.TEXT_ORDER_SALES_DETAILS')}
                subTitle=''
                showArrow={true}
                onPress={() => this.onPressSale()} 
            />
        )
    }

    onPressSale(){
        Actions.push('SalesList')
    }

    teamEarn(){
        const {teamCommission} = this.props.user;
        const {inviteAward} = teamCommission;
        const unit ='$';
        return(
            <View style={[styles.common,{paddingTop:Utils.scale(20),paddingBottom:Utils.scale(20)}]}>
                <View style={{paddingBottom:Utils.scale(20)}}>
                    <OText style={{fontSize:Utils.scale(17), fontWeight:'bold'}} text={'SALEORDER.STORE_SALE_TEAM_EARN'}></OText>
                </View>
                <View style={styles.textLayout}>
                    <Text style={{fontSize:Utils.scale(14),color:Constant.blackText}}>{I18n('SALEORDER.STORE_SALE_FRIEND_REWARD', { unit })}</Text>
                    <Text style={{fontSize:Utils.scale(14),color:Constant.themeText, fontWeight:'bold'}}>{'+'}{inviteAward}</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    common: {
        paddingLeft:Utils.scale(16),
        paddingRight:Utils.scale(16),
        paddingBottom:Utils.scale(17),
    },
    textLayout: {
        flexDirection:'row',
        justifyContent:'space-between',
        paddingBottom:Utils.scale(17),
    },
    scroll: {
        backgroundColor: Constant.boldLine,
    },
    tabBoder: {
        height:Utils.scale(32),
        borderRadius: Utils.scale(16),
        borderWidth: Utils.scale(1),
        borderColor: Constant.blackText,
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    allTabSty: {
        flex:1,
        height:Utils.scale(32),
        // borderRightWidth: Utils.scale(1),
        // borderColor: Constant.blackText,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabSelectSty:{
        //flex:1, 
        //width:Utils.scale(86),
        justifyContent: 'center',
        backgroundColor:Constant.blackText,
        //height:Utils.scale(32),
    }
})