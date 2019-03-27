import { Actions } from 'react-native-router-flux';
import { toJS } from '../../node_modules/mobx';
import AppSetting from '../store/AppSetting';
import CommonWebView, {
    NAVIGATION_SUSPENSION,
    NAVIGATION_BACK,
    NAVIGATION_HIDE
} from '../pages/CommonWebView/CommonWebView';

export default class ActionToPage {

    static jumpFun(obj) {
        try {
            // console.log('jumpFun(obj)---------------', toJS(obj))
            const { linkId, linkType, categoryName, staticUrl } = obj;
            switch (linkType) {
                case 0:
                    break;
                case 1:
                    Actions.push('CategoryList', {
                        id: linkId,
                        title: categoryName
                    })
                    break;
                case 2:
                    Actions.push('CategoryList', {
                        id: linkId,
                        title: categoryName
                    })
                    break;
                case 3:
                    Actions.push('GoodsDetail', { productId: linkId })
                    break;
                case 4:
                    Actions.push('FlashSale')
                    break;
                case 5:
                    Actions.push('HighBonusList')
                    break;
                case 6:
                    Actions.push('DailyNewList')
                    break;
                // 专场
                case 7:
                    console.log('打开专场页面')
                    Actions.push('CollectionListPage', { catObj: obj })
                    break;
                // 静态页
                case 8:
                    this.pushToWebView(staticUrl)
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log('========err', error);
        }

    }

    static pushToWebView(url) {
        let nextUrl = '';
        if (url && url.length > 0) {
            // nextUrl = 'https://www.baidu.com?userId=\'abcdefg\'&platform=\'ios\''
            nextUrl = url;
            // console.log('pushToWebView(url)----------',nextUrl)
        } else {
            console.log('Banner 的 URL 为空，不能跳转')
            return;
        }

        Actions.push('CommonWebView', {
            titleData: {
                titleType: NAVIGATION_BACK,
                title: '',
            },
            nextUrl: nextUrl,
            homeWeb: false
        });
    }

}
