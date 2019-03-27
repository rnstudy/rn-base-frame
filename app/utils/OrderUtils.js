import React, { Component } from 'react';

export default class OrderUtils extends Component {

    static ORDERS_ALL = '';
    static ORDERS_PENDING = 'unpaid';
    static ORDERS_PROCESSING = 'paided';
    static ORDERS_IN_TRANSIT = 'shipped';
    static ORDERS_COMPLETE = 'finished';
    static ORDERS_REFUNDED = 'refunded';

    //构造函数，默认的props，以及state 都可以在这里初始化了
    constructor(props) {
        super(props);
    }

    static getOrderStatus(status) {
        let odState = '';//待付款
        let earnText = "";//收入
        switch (status + '') {
            case '0':
                odState = 'ORDER.ORDERS_PENDING'//待付款
                //earnText = 'SALEORDER.STORE_SALE_ORDERS_FORECAST_EARNINGS'//预估佣金
                break;
            case '1':
                odState = 'ORDER.ORDER_DETAIL_STATUS_PAIDED'//待发货
                earnText = 'SALEORDER.STORE_SALE_ORDERS_FORECAST_EARNINGS'//预估佣金
                break;
            case '2':
                odState = 'ORDER.ORDER_DETAIL_STATUS_PAIDED'//待发货
                earnText = 'SALEORDER.STORE_SALE_ORDERS_FORECAST_EARNINGS'//预估佣金
                break;
            case '3':
                odState = 'ORDER.ORDER_DETAIL_STATUS_SHIPPED'//待收货
                earnText = 'SALEORDER.STORE_SALE_ORDERS_FORECAST_EARNINGS'//预估佣金
                break;
            case '4':
                odState = 'ORDER.ORDER_DETAIL_STATUS_REFUNDING'//退款中
                break;
            case '5':
                odState = 'ORDER.ORDER_DETAIL_STATUS_REFUNDED'//已退款
                earnText = 'ORDER.ORDER_DETAIL_STATUS_EXPIRED'//已失效
                break;
            case '6':
                odState = 'ORDER.STORE_ORDERS_PROCESSING'//待发货
                earnText = 'SALEORDER.STORE_SALE_ORDERS_FORECAST_EARNINGS'//预估佣金
                break;
            case '7':
                odState = 'ORDER.STORE_ORDERS_COMPLETE'//已完成
                earnText = 'ORDER.STORE_ORDERS_COMPLETE'//已完成
                break;
            case '8':
                odState = 'ORDER.ORDER_DETAIL_STATUS_EXPIRED'//已失效
                earnText = 'ORDER.ORDER_DETAIL_STATUS_EXPIRED'//已失效
                break;
            default:
                odState = ''
                break;
        }

        let orderStatus = {
            status: status + '',
            statusText: odState,
            earnText: earnText,
        };
        return orderStatus;
    }
}