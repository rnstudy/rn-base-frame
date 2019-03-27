import React, { Component } from 'react';
import I18n from '../config/i18n';

export default class PaymentUtils extends Component {
    //构造函数，默认的props，以及state 都可以在这里初始化了
    constructor(props) {
        super(props);
    }

    static getPaymentMethod(payType) {
        let paymentMethodText = 'ORDERDETAIL.ORDER_DETAIL_PAYTYPE_NO_CHOOSE';
        if (payType == null) {
            console.log('payType为空');
            return {
                payType: '',
                paymentMethodText: I18n(paymentMethodText),
            }
        }
        console.log('payType不为空');
        switch (payType + '') {
            case '0':
                paymentMethodText = 'ORDERDETAIL.ORDER_DETAIL_PAYTYPE_WEIXIN';
                break;
            case '1':
                paymentMethodText = 'ORDERDETAIL.ORDER_DETAIL_PAYTYPE_PAYPAL';
                break;
            case '2':
                paymentMethodText = 'ORDERDETAIL.ORDER_DETAIL_PAYTYPE_WORLDPAY';
                break;
            case '3':
                paymentMethodText = 'ORDERDETAIL.ORDER_DETAIL_PAYTYPE_STRIPE';
                break;
            default:
                break;
        }
        let paymentMethod = {
            payType: payType,
            paymentMethodText: I18n(paymentMethodText),
        }
        return paymentMethod;
    }
}