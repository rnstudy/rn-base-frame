import React, { Component } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Dimensions,
    InteractionManager
} from "react-native";
import { inject, observer } from "mobx-react/native";
import ScrollableTabView from 'react-native-scrollable-tab-view';

import CommonHeader from "../../component/Header/CommonHeader";
import PointCard from '../../component/PointCard/PointCard';
import MoreTitleList from '../../pages/More/MoreTitleList'
import BoldLine from "../../component/BoldLine/BoldLine"
import ScrollTabBar from '../../component/ScrollTabBar/ScrollTabBar';
import I18n from '../../config/i18n'
import Utils from "../../utils/Utils";
import * as Constant from '../../utils/Constant';
import { bold } from "ansi-colors";
import { toJS } from "mobx";
import OText from "../../component/OText/OText";
import { Actions } from "react-native-router-flux";
//import { width } from "window-size";
//icon
import OOPS_LIST_EMPTY from '../../res/images/oops_list_empty.png'
const { width, height } = Dimensions.get('window');

const temp = [
    { title: 'WALLET.ACCOUNT_ALL', index: '' },
    { title: 'SALEORDER.STORE_PERSONAL_Earnings', index: '0' },
    { title: 'WALLET.EXPENDITURE', index: '1' }
]



@inject(stores => ({
    user: stores.user,
}))
@observer
export default class WalletList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            btnIndex: '0',
            refreshing:false,
        }
    }


    componentWillMount() {
        this.onRefresh();
    }
    onRefresh(){

        const { shopkeeperInfo } = this.props.user;
        const { userId } = shopkeeperInfo;
        //let btnIndex ='0';
        this.setState({
            btnIndex: '0',
        })
        if(this.state.refreshing){
            return
        }
        this.setState({
            refreshing:true,
        },() => {
            this.props.user.getCommissionStatements(this.state.btnIndex, userId,() => this.endRefresh());
        })
        
    }

    endRefresh() {
        this.setState({ refreshing: false })
    }

    render() {
        //console.log('WalletList',this.props.user.commissionAndPoint);

        return (

            <CommonHeader title={I18n("PERSON.TEXT_MY_WALLET")}>
                {this.renderView()}
            </CommonHeader>
        )
    }

    renderView() {
        const { commissionAndPoint } = this.props.user;
        const { totalCommission, balanceCommission, pendingCommission, currencyType, unit } = commissionAndPoint;
        // let bgStyle = {
        //     height: Utils.scale(159),
        //     backgroundColor: Constant.blackText,
        //     marginTop: Utils.scale(24),
        //     marginBottom: Utils.scale(30),
        //     marginLeft: Utils.scale(11),
        //     marginRight: Utils.scale(11),
        // };
        return (
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
                    {/* 黑框 */}
                    <View style={styles.background}>
                        <View>
                            <Text style={styles.title}>{I18n('SALEORDER.STORE_PERSONAL_BALANCE', { unit })}</Text>
                            <Text style={styles.earning}>{unit + balanceCommission}</Text>
                        </View>
                        <View style={{ marginTop: Utils.scale(16) }}>
                            <Text style={styles.subtitle}>{I18n('SALEORDER.STORE_PERSONAL_PENDING')}</Text>
                            <Text style={styles.subnum}>{pendingCommission}</Text>
                        </View>
                    </View>
                    {/* 历史提现 */}
                    <View>
                        < MoreTitleList
                            title={I18n('STORE_WITHDRAW_HISTORY')}
                            subTitle=''
                            showArrow={true}
                        onPress={() => this.onPressWithdrawHistory()} 
                        />
                    </View>
                    <BoldLine />

                    {this.renderTabList()}
                </View>
            </ScrollView>

        )
    }
    onPressWithdrawHistory(){
        Actions.push('WithdrawHistory')
    }

    renderTabList() {
        try {
            const { shopkeeperInfo, commissionStatements } = this.props.user;
            const { items, unit } = commissionStatements;
            return (
                <View style={{ flex: 1, backgroundColor: '#FFF', }}>
                    <View style={styles.tabList}>
                        {temp.map((obj, index) => {
                            return <TouchableOpacity
                                onPress={() => this.pressBtn(index)}
                                style={index + '' === this.state.btnIndex + '' ? styles.tabSelect : null}
                                key={index}
                            >
                                <OText
                                    style={styles.tabText}
                                    text={obj.title}
                                />
                            </TouchableOpacity>
                        })}
                    </View>
                    {/* {console.log('----items',items)} */}
                    { items && items.length > 0 ? <View style={styles.container}>
                        <FlatList
                            data={items}
                            renderItem={({ item }) => this.renderWalletList(item)}
                            keyExtractor={(item, index) => (item.orderId + '' + index)}
                        />
                        <View style={styles.tipsSty}>
                            <View>
                                <OText style={{color:Constant.grayText}} text={'COMMON.TEXT_END_TIP'}></OText>
                            </View>
                        </View> 
                    </View>:
                    <View style={styles.errorViewSty}>
                        <Image source={OOPS_LIST_EMPTY}></Image>
                    </View>
                }
                </View>
            )
        } catch (error) {
            return <View></View>
        }

    }
    pressBtn(btnIndex) {
        const { shopkeeperInfo } = this.props.user;
        const { userId } = shopkeeperInfo;
        this.setState({
            btnIndex: btnIndex,
        });
        // console.log('---|||--',btnIndex, userId)
        this.props.user.getCommissionStatements(btnIndex, userId);

    }

    renderWalletList(item) {
        //console.log('enderWalletList(item)',item);    
        let indexTitle = Utils.switchWalletSourceType(item.source);
        let commissioncount = Math.abs(item.commission);
        const {commissionStatements} = this.props.user;
        const {unit} = commissionStatements;

        return (
            <View style={styles.WalletListSty}>
                <View style={{ flexDirection: 'column',justifyContent:'center'}}>
                    <Text style={{fontSize:Utils.scale(14), color:Constant.blackText, marginBottom:Utils.scale(6)}}>{indexTitle}</Text>
                    {item &&  item.detailOrders.length > 0 ? <Text>{item.detailOrders[0].orderCode}</Text> : null}
                    <Text>{item.payTime}</Text>
                </View>
                <View style={{ flexDirection: 'column',justifyContent:'center'}}>
                    <Text style={ item.commission >= 0 ? styles.positive : styles.negative}>
                        {item.commission && item.commission >= 0 ? '+' : '-'}{unit + commissioncount}
                    </Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    scroll: {
        backgroundColor: Constant.boldLine,
    },
    background: {
        backgroundColor: Constant.blackText,
        height: Utils.scale(159),
        alignItems: 'flex-start',
        paddingTop: Utils.scale(24),
        paddingBottom: Utils.scale(24),
        paddingLeft: Utils.scale(16),
    },
    title: {
        fontSize: Utils.scale(12),
        color: '#FFFFFF',
    },
    earning: {
        fontSize: Utils.scale(34),
        fontWeight: 'bold',
        color: '#FFD6C2',

    },
    subtitle: {
        fontSize: Utils.scale(12),
        color: '#FFFFFF',
    },
    subnum: {
        fontSize: Utils.scale(12),
        color: '#FFD6C2',
    },
    tabList: {
        height: Utils.scale(46),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: Utils.scale(18),
        borderBottomWidth: Utils.scale(2),
        borderBottomColor: Constant.boldLine,
    },
    tabSelect: {
        borderBottomWidth: Utils.scale(2),
        borderBottomColor: Constant.bottomBtnBg,
    },
    tabText: {
        fontSize: Utils.scale(14),
        fontWeight: 'bold',
        paddingBottom: Utils.scale(8),

    },
    container: {
        flex: 1,
        paddingTop: 22
    },
    tipsSty:{
        height:Utils.scale(75),
        flexDirection: 'row', 
        justifyContent:'center',
        alignItems:'center'
    },
    WalletListSty: {
        flex:1,
        flexDirection: 'row', 
        justifyContent:'space-between',
        paddingTop:Utils.scale(13),
        paddingBottom:Utils.scale(17),
        paddingRight:Utils.scale(16),
        paddingLeft:Utils.scale(16),
        borderBottomWidth:Utils.scale(1),
        borderBottomColor:Constant.boldLine,
    },
    positive: {
        fontSize:Utils.scale(14),
        color: Constant.bottomBtnBg,
    },
    negative: {
        fontSize:Utils.scale(14),
        color: Constant.blackText,
    },
    errorViewSty:{
        backgroundColor:Constant.boldLine,
        height:height-Utils.scale(321),
        justifyContent:'center',
        alignItems:'center'
    },
    errorImg:{
        height:Utils.scale(120),
        width:Utils.scale(120),
    }

})
