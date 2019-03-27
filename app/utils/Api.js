//export const  BASE_URL = 'http://10.100.225.212:7080';
// export const BASE_URL = 'http://10.100.226.227:7082';

// export const BASE_URL = 'https://octopus.shuqian123.com';// 美国测试
// export const BASE_URL = 'https://octopus-1.shuqian123.com';// 新加坡测试

//-----------------Web URL-----------------
// 首页选品
export const CHOOSEGOODS = "/store/choosegoods";
export const GOODS_DETAIL = "/store/detail/";
export const STORE_ACCOUNT = "/store/account/";

//订单详情
export const ORDER_DETAIL = "/store/sale/orderdetail?orderId=";

// 个人中心
export const WEB_PERSONAL_MORE = "/store/personal/more";
export const WEB_PERSONALINFO = "/store/personalinfo";
export const WEB_WITHDRAW = "/store/withdraw";
export const WEB_ALLORDERS = "/store/orders/order";
export const WEB_PENDING = "/store/orders/order/unpaid";
export const WEB_PROCESSING = "/store/orders/order/paided";
export const WEB_INTRANSIT = "/store/orders/order/shipped";
export const WEB_RETURNREFUND = "/store/orders/order/refunded";
export const WEB_PERSON_GUIDE = "/store/personal/personguide";

// 销售
export const WEB_SALEINCOMEDAY = "/store/saleincome/day";
export const WEB_SALEINCOMEWEEK = "/store/saleincome/week";
export const WEB_SALEINCOMEMONTH = "/store/saleincome/month";
export const WEB_SALEINCOMETOTAL = "/store/saleincome/total";
export const WEB_STORE_TEAM = "/store/team";

//积分
export const WEB_COMMISSION = "/commission";
export const WEB_STORE_POINT = "/storepoint";

//团队佣金
export const TEAM_COMMISSION = '/api/team/get_team_count'
// 地址
export const WEB_ADDRESS_BOOK = "/addressbook/personal";

// 密码
export const WEB_CHANGE_PASSWORD = "/changepassword?%2Fstore%2Fpersonal";

// 合伙人申请
export const WEB_APPLY_STORE = "/applystore";

// 合伙人申请提交成功
// null

// 合伙人申请审核中
export const WEB_APPLY_REVIEWING = "/applyreviewing";

// 合伙人申请不通过
export const WEB_APPLY_REVIEWFAIL = "/applyreviewfail";

//-----------------API-----------------
// 获取个人信息
export const GET_USER_INFO = "/api/user/get_user_info";

// 登陆验证码
export const VERIFICATION_CODE = "/api/get_verification_code";

// 申请合伙人数据
//export const STORE_APPLY = '/api/store/apply_v2';
export const STORE_APPLY = "/api/store/invite_to_join";

// 获取首页类目
export const HOME_CATEGORIES = "/api/store/get_categories";

//获取所有销售分类（新）
export const HOME_CATEGORIES_NEW = "/api/category/get_first_categories";
export const HOME_CATEGORIES_SECOND = "/api/category/get_second_categories";
export const HOME_BANNER_DATA = "/api/vertisement/get_store_ad";
export const HOME_FLASH_SPECIAL = "/api/goods/getFlashSpecial";
export const HOME_SINGLE_SPECIAL = "/api/goods/getSingleSpecial";
export const HOME_SPECIAL_LIST = "/api/goods/getSpecialGoodsBySpid";
export const HOME_GIFT_ID = "/api/special/get_gift_special";

// 获取首页商品列表
export const RECOMMEND_PRODUCT = "/api/store/recommend_product";
export const PRODUCT_LIST = "/api/category/get_product_list";
export const HIGH_BONUS = "/api/store/get_product_list_high_bonus";
export const DAILY_NEW = "/api/store/get_product_list_daily_new";
export const HOME_RECOMMENDED = "/api/store/get_product_list_recommended";
export const COLLECTION_LIST = "/api/store/get_collection_product_list";
export const EXPRESS_LIST = "/api/store/get_product_list_express";

// 秒杀列表
export const FLASH_SALE_LIST = "/api/flashsale/get_flash_sale_list";

// 秒杀商品
export const FLASH_SALE_INFO = "/api/flashsale/get_flash_sale_info";
export const FLASH_SALE_INFO_HOME = "/api/flashsale/get_flash_sale_info";

// 获取店铺信息
export const STORE_INFO = "/api/store/info";
// 删除店铺商品
export const STORE_TAKE_OFF = "/api/store/take_off_shelves";

// 店主信息
export const SHOPKEEPER_INFO = "/api/store/get_info";

// 剩余佣金
export const REMAINING_COMMESSION = "/api/store/get_remaining_commession";

//获取全部佣金
// export const GET_TOTAL_COMMISSION = "/api/point/get_total_commission";
export const GET_TOTAL_COMMISSION = "/api/store/get_total_commission";

//获取全部积分
export const GET_TOTAL_POINT = "/api/point/get_total_point";

// 获取选中商品列表
export const SELECTED_PRODUCT = "/api/store/selected_product";

// 获取购物车有效列表
export const SHOP_CART_LIST = "/api/cart/queryList";
// 获取购物车失效列表
export const SHOP_CART_INVALID_LIST = "/api/cart/queryInvalidList";
// 获取购物车信息
export const SHOP_CART_MSG = "/api/cart/getCartMsg";
// 获取购物车商品数量更变
export const SHOP_CART_NUMBER_CHANGE = "/api/cart/commodityNumberChange";
// 获取购物车商品删除
export const SHOP_CART_REMOVE_COMMODITY = "/api/cart/removeCommodity";
// 获取购物车失效清空
export const SHOP_CART_CLEAN_COMMODITY = "/api/cart/cleanInvalidCommodity";
// 获取购物车失效清空
export const CHECK_OUT = "/api/order/get_checkout_v3";

// 设置收件地址
export const SHOP_CART_SET_ADDRESS = "/api/shoppingcart/set_address";

// 二维码短链
export const SHARE_SHORT_LINK = "/api/share/generate_short_link";

// 修改购物车商品内容
export const SHOP_CART_MODIFY = "/api/shoppingcart/modify_v2";

// 检查购物车库存
export const SHOP_CART_INVENTORY = "/api/shoppingcart/get_inventory_v2";

// 设置性别
export const SET_GENDER = "/api/user/update_user_sex";

export const HEAD_IMG_UPLOAD = "/api/user/upload_head_img";
//用户头像-是否有待审核的头像
export const HAS_WAIT_HEAD = "/api/user/has_wait_head_img";

export const BACKGOROUND_IMG_UPLOAD = "/api/store/upload_store_background_img";

// 标签列表
export const TAG_LIST = "/api/tag/get_tags_by_user";

// 更新标签
export const TAG_UPDATE = "/api/tag/update_tags_by_user";

// 获取品类分类
export const CATEGORIES = "/api/category/get_home_categories";

//lookbook详情页面
export const LOOKBOOK_DETAIL = "/api/lookbook/postdetail";

// 首页列表
export const INDEX_LIST = "/api/home/index";

// 商品详情
export const PRODUCT_DETAIL = "/api/goods/getBySku";

// 商品详情
export const PROD_SIZE_CHART = "/api/product/prodsizechart";

// 商品详情_详细图
export const IMG_DETAIL = "/api/product/detail_img";

// 是否已加店铺
export const EXIST_STORE = "/api/store/is_exist_store_product";

// 是否已加店铺
export const ADD_STORE = "/api/store/add_shelves";

// 加入购物车
export const ADD_TO_CART = "/api/cart/addCommodity";

// 团购详情
export const GROUP_DETAIL = "/api/group/detail";

// 某单品拼团列表
export const GROUP_LIST = "/api/group/list";

// 场景页详情
export const AISPECIALS_DETAIL = "/api/product/aispecialsdetail";

// SizeChart
export const SIZE_CHART = "/api/product/prodsizechart";

// You may also like
export const PRODUCT_LIKE = "/api/home/like";

// Checkout
export const CHECKOUT = "/api/order/checkout";

// 地区列表
export const STATE_LIST = "/api/address/get_state_list";
export const CITY_LIST = "/api/address/get_state_citys";

// 更新地址
export const ADDRESS_UPDATE = "/api/address/update";

// 订单页
export const GET_USER_ORDER = "/api/order/get_user_order";

//订单详情页
export const GET_ORDER_DETAIL = "/api/order/get_order_detail";

//物流状态
export const GET_LOGISTICS = "/api/order/get_logistics_info";

// 场景页商品列表
export const ACTIVITY_LIST = "/api/list/flashsale";

//创建订单
export const CREATE_ORDER = "/api/order/unified_order";

//创建订单
export const ORDER_PAY = "/api/order/pay";

// paypal支付确认
export const PAPAL_PAYMENT = "/api/paypal/payment";

// 根据categoryId获取商品列表
export const CATEGORY_PRODUCT_LIST =
    "/api/home/get_product_list_by_category_id";

//验证码   
export const VERIFY_CODE = "/api/user/verify_code";

// 团长详情
export const COMMISSION_SALESMAN_DETAIL = "/api/user/get_salesman_detail";

// 团长 Order List
export const COMMISSION_SALES_LIST = "/api/user/get_salesman_orderlist";

// 团长Order Detail
export const COMMISSION_SALES_ORDERDETAIL =
    "/api/user/get_salesman_order_detail";

//注册
export const SIGNUP = "/api/user/signup";

//重发验证码
export const RESEND_CODE = "/api/user/resend_code";

//登录
export const SIGNIN = "/api/user/signin";

//忘记密码
export const FORGET_PASSWD = "/api/user/forget_passwd";

// 重置密码
export const RESET_PASSWORD = "/api/user/reset_passwd";

//修改密码
export const CHANGE_PASSWORD = "/api/user/change_passwd";

//获取clientID
export const GET_CLIENT_ID = "/api/instagram/get_client_id";

//instagram登录
export const INSTAGRAM_LOGIN = "/api/instagram/auth";

//ins redirect uri
export const REDIRECT_URI = "/api/instagram/login_redirect";

//店铺订单列表接口
export const STORE_ORDER_LIST = "/api/store/order_list";

//店铺订单详情接口
export const STORE_ORDER_DETAIL = "/api/store/order_detail";

//查询专场
export const STORE_QUERY_COLLECTION = "/api/store/query_collections";
//详情
export const STORE_COLLECTION_DETAIL = "/api/store/get_collection_detail";
//排序
export const STORE_COLLECTION_SORT = "/api/store/sort_collections";
//删除
export const STORE_COLLECTION_DEL = "/api/store/delete_collections";
//新建/编辑专场
export const STORE_COLLECTION_EDIT = "/api/store/editor_collection";

//获取确认订单可用积分佣金
export const USABLE_POINT = "/api/order/get_usable_point_and_commission";

//生成订单
export const UNIFIED_ORDER = "/api/order/unified_order_v2";

//支付
export const PAY_ORDER = "/api/order/pay";
export const PAY_WECHAT = "/api/wechat/pay";

// 切换语言
export const CHANGE_LANG = "/api/change_lang";

// 获取用户地址列表
export const ADDRESS_LIST = "/api/address/get_list";

// 添加或更新地址
export const ADDRESS_UPSERT = "/api/address/upsert";
export const UPDATE_EMAIL = "/api/address/update_email";

// 将地址设为默认
export const ADDRESS_SET_DEFAULT = "/api/address/set_default";

// 删除地址
export const ADDRESS_DEL = "/api/address/del";

// 提现历史记录
export const WITHDRAW_HISTORY = "/api/store/get_sale_settlements";

export const STORE_UPDATE = "/api/store/updateInfo";

// 提现详情
export const WITHDRAW_DETAIL = "/api/store/get_sale_settlement_details";

// facebook 登录
export const FB_USER_INFO = "/api/facebook/getUserInfo";

// 微信登录
export const WX_AUTH = "/api/wechat/app_login_redirect";

// 获取团队销售信息
export const TEAM_INFO = "/api/team/get_team_info";

// 团队活动是否开始
export const TEAM_ACTIVITY_START = "/api/team/is_activity_start";

// 团队活动门槛和已达销售额
export const TEAM_ACTIVITY_INFO = "/api/team/get_amount_and_threshold";

// 团队成员列表
export const TEAM_MEMBER_LIST = "/api/team/get_team_member_list";

// 团队活动列表
export const TEAM_ACTIVITY_LIST = "/api/team/get_activity_list";

// 团队成员销售明细
export const TEAM_ACTIVITY_SALES = "/api/team/team_member_sale_amount";

//检查上传店铺背景
export const HAS_STORE_BG = "/api/store/has_wait_store_background_img";

// 查询分类
export const STORE_CATEGORY = "/api/category/get_category_list";

// 根据分类查询商品
export const STORE_CATEGORY_PRODUCT =
    "/api/category/get_store_category_product_list";

// 搜索关键词
export const SEARCH_TIPS = "/api/search/tips";

// 按关键词提示搜索商品
export const SEARCH_PRODUCT_LIST = "/api/search/search";

//我的钱包
export const GET_COMMISION_STATEMENTS = "/api/point/get_commission_statements";

//物流追踪
export const GET_LOGISTICS_EVENT = "/api/order/get_logistics_event";

//获取佣金团队列表
export const GET_TEAM_SALES_DETAIL = "/api/team/get_team_sales_detail" ;