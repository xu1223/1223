export default {
    get_user_menus: "/api/member/get_menu_list_pager.json", //获取商户菜单列表
    get_user_manager: "/api/member/get_member.json", //获取用户对象
    get_access_token_cache: "/api/get_access_token_cache.json", //获取用户对象
    //商城后台              

    login: "/api/auth/member_login_do.json", //登陆
    member_logout: "/api/auth/member_logout.json", //登出



    //商城后台
    //  基础设置
    // get_access_token_cache: "GET /api/get_access_token_cache.json", //获取token
    get_countrys_pager: 'POST /api/admin/get_countrys_pager', //国家列表
    get_zones_pager: 'POST /api/admin/get_zones_pager', //地区列表
    get_manager_list: 'POST /api/admin/get_manager_list', //客服
    get_customers_group_pager: 'POST /api/admin/get_customers_group_pager', //会员等级  
    get_sources_channel_contrast_pager: 'POST /api/admin/get_sources_channel_contrast_pager', //渠道来源  
    get_categorys_pager: 'POST /api/admin/get_categorys_pager', //分类列表  

    get_customer_wishlist_product: 'POST /api/admin/get_customer_wishlist_product', //获取收藏列表
    get_customer_carts_detail: 'POST /api/admin/get_customer_carts_detail', //获取购物车列表
    get_geo_zones_pager: 'POST /api/admin/get_geo_zones_pager', //获取物流方式
    get_pay_method: 'POST /api/admin/get_pay_method', //获取支付方式
    get_all_channel_contrast: 'POST /api/admin/get_all_channel_contrast', //获取所有来源方式
    get_all_geo_zone_name: 'POST /api/admin/get_all_geo_zone_name', //获取所有物流方式




    //商品模块
    get_products_pager: 'POST /api/admin/get_products_pager', //商品列表 /api/cart/get_tree_category_simple
    get_categorys_pager: 'POST /api/admin/get_categorys_pager', //分类列表接口 
    get_tree_category_simple: 'POST /api/admin/get_tree_category_simple', //分类列表接口 
    get_category_search: 'POST /api/admin/get_category_search', //分类-搜索标签
    get_category_option_value: 'POST /api/admin/get_category_option_value', //分类-属性/属性值
    save_product_basic: 'POST /api/admin/save_product_basic', //商品保存 商品ID 有值代表编辑 没值代表新增
    product_image_upload: 'POST /api/admin/product_image_upload', //商品管理-图片上传接口
    get_product: 'POST /api/admin/get_product', //商品管理-商品详情 
    del_param_option: 'POST /api/admin/del_param_option', //商品管理-属性删除 
    del_param_option_value: 'POST /api/admin/del_param_option_value', //删除属性值 软删除 
    del_size_template: 'POST /api/admin/del_size_template', //商品尺码表 删除  /admin/
    save_size_template: 'POST /api/admin/save_size_template', //商品尺码表模板增改
    get_size_template_pager: 'POST /api/admin/get_size_template_pager', //商品尺码表 分页列表
    export_products_sp: 'POST /api/admin/export_products_sp', //批量导出SP商品接口
    export_products_hx: 'POST /api/admin/export_products_hx', //批量导出hx商品接口
    product_publish: 'POST /api/admin/batch_product_publish', //商品上下架
    batch_product_size_publish: 'POST /api/admin/batch_product_size_publish', //[批量]指定尺码上下架
    transfer_category_product: 'POST /api/admin/transfer_category_product', //分类管理-转移产品接口
    category_del: 'POST /api/admin/category_del', //删除分类
    save_category: 'POST /api/admin/save_category', //分类增改接口
    get_param_option_value_pager: 'POST /api/admin/get_param_option_value_pager', //获取对应属性的属性值分页列表
    get_param_option_pager: 'POST /api/admin/get_param_option_pager', //属性值分页列表
    save_param_option_status: 'POST /api/admin/save_param_option_status', //列表保存属性状态值
    save_param_option: 'POST /api/admin/save_param_option', //属性保存
    get_search_pager: 'POST /api/admin/get_search_pager', //搜索标签列表-分页
    save_search: 'POST /api/admin/save_search', //搜索标签保存
    del_search: 'POST /api/admin/del_search', //搜索标签保存
    get_search_list: "/api/admin/get_search_list", //搜索标签列表，用于下拉选择项数据
    save_param_option_value: "/api/admin/save_param_option_value", //属性值保存
    save_search_status: "/api/admin/save_search_status", //列表保存搜索标签状态值
    get_filter_pager: "/api/admin/get_filter_pager", //筛选器分页列表
    save_filter_list: "/api/admin/save_filter_list", //保存筛选器 - 列表操作
    del_filter: "/api/admin/del_filter", //删除筛选器
    save_filter: "/api/admin/save_filter", //保存筛选器
    get_param_option_list: "/api/admin/get_param_option_list", //获取属性列表
    get_filter: "/api/admin/get_filter", //筛选器详情
    get_category: "/api/admin/get_category", //分类详情
    save_category_list: "/api/admin/save_category_list", //分类保存 - 列表操作
    get_filter_list: "/api/admin/get_filter_list", //筛选器列表
    get_category_tree_list: "/api/admin/get_category_tree_list", //分类树形列表
    get_search_list: "/api/admin/get_search_list", //商品标签列表
    batch_edit_product_detail: "POST /api/admin/batch_edit_product_detail", //商品标签列表
    batch_product_zsku_publish: "POST /api/admin/batch_product_zsku_publish", //zsku上下架
    get_option_products: "POST /api/admin/get_option_products", //商品列表（以商品尺码为维度，适用弹窗位置）
    //会员中心

    get_customers_pager: 'POST /api/admin/get_customers_pager', //会员列表
    get_customer: 'POST /api/admin/get_customer', // 会员详情
    add_customer: 'POST /api/admin/add_customer', //新增会员
    transfer_to_manager: 'POST /api/admin/transfer_to_manager', //转移客服  
    save_customer: 'POST /api/admin/save_customer', //会员详情修改接口  
    save_review_status: 'POST /api/admin/save_review_status', //会员详情中评论状态修改接口  
    save_review: 'POST /api/admin/save_review', //会员详情中评论修改接口 
    save_customer_address: 'POST /api/admin/save_customer_address', //会员详情-会员地址增改接口  
    get_customer_address_pager: 'POST /api/admin/get_customer_address_pager', //会员地址
    save_message_view: 'POST /api/admin/save_message_view', //当收件箱列表点击回复查看详情时调用此接口

    // 订阅列表
    get_newsletters_pager: 'POST /api/admin/get_newsletters_pager', //订阅列表接口
    newsletter_cancel: 'POST /api/admin/newsletter_cancel', //取消订阅
    //购物车
    get_customer_carts_pager: 'POST /api/admin/get_customer_carts_pager', //购物车列表
    customer_cart_export: 'POST /api/admin/customer_cart_export', //购物车导出
    get_customer_carts_detail: 'POST /api/admin/get_customer_carts_detail', //购物车详情
    save_cart_product: 'POST /api/admin/save_cart_product', //增加购物车商品/修改购物车商品数量
    send_reminder_payment_notice: 'POST /api/admin/send_reminder_payment_notice', //批量发送催单通知
    save_cart_to_wishlist: 'POST /api/admin/save_cart_to_wishlist', //会员购物车转至会员收藏
    del_cart_product: 'POST /api/admin/del_cart_product', //会员购物车删除
    del_customer_address: 'POST /api/admin/del_customer_address', //删除会员地址接口 
    get_products_pager: 'POST /api/admin/get_products_pager', //会员购物车删除
    get_products_by_spu: 'POST /api/admin/get_products_by_spu', //选择SPU，
    //心愿单
    get_customer_wishlist: 'POST /api/admin/get_customer_wishlist', //会员收藏接口
    del_customer_wishlist: 'POST /api/admin/del_customer_wishlist', //会员收藏删除
    save_wishlist_to_cart: 'POST /api/admin/save_wishlist_to_cart', //会员收藏转至会员购物车接口
    // 评论
    review_del: 'POST /api/admin/review_del', //会员删除评论
    save_review: 'POST /api/admin/save_review', //添加修改商品评论
    get_reviews_pager: 'POST /api/admin/get_reviews_pager', //获取评论列表
    // 邮件
    get_receive_message_pager: 'POST /api/admin/get_receive_message_pager', //会员邮件收件箱列表接口
    get_draft_message_pager: 'POST /api/admin/get_draft_message_pager', //会员邮件草稿箱列表接口
    get_draft_message: 'POST /api/admin/get_draft_message', //会员邮件草稿箱详情
    get_sent_message_pager: 'POST /api/admin/get_sent_message_pager', //会员邮件已发送列表接口
    del_draft_message: 'POST /api/admin/del_draft_message', //会员邮件草稿箱删除
    del_message: 'POST /api/admin/del_message', //会员邮件箱删除
    save_message_view: 'POST /api/admin/save_message_view', //邮件修改未读为已读
    get_message: 'POST /api/admin/get_message', //邮件详情
    save_tag_to_message: 'POST /api/admin/save_tag_to_message', //邮件标签添加
    save_message_tag: 'POST /api/admin/save_message_tag', //邮件标签保存
    get_message_tag_list: 'POST /api/admin/get_message_tag_list', //邮件标签列表
    save_message_approval: 'POST /api/admin/save_message_approval', //邮件审核
    get_message_sign: 'POST /api/admin/get_message_sign', //邮件设置
    save_message_sign: 'POST /api/admin/save_message_sign', //邮件设置保存

    del_message_tag: 'POST /api/admin/del_message_tag', //邮件标签删除
    save_message: 'POST /api/admin/save_message', //邮件发送/定时发送
    get_customer_list: 'POST /api/admin/get_customer_list', //邮件-候选邮箱列表
    save_message_draft: 'POST /api/admin/save_message_draft', //邮件存草稿

    // 订单模块
    get_orders_pager: 'POST /api/admin/get_orders_pager', //订单列表
    get_order: 'POST /api/admin/get_order', //订单详情
    marked_processing: 'POST /api/admin/marked_processing', //订单标记处理接口
    order_export: 'POST /api/admin/order_export', //订单导出 单条/批量
    marked_deliver_goods: 'POST /api/admin/marked_deliver_goods', //标记发货
    send_payment_notice: 'POST /api/admin/send_payment_notice', //发送催款通知
    send_confirm_payment: 'POST /api/admin/send_confirm_payment', //发送收款通知
    activation_order: 'POST /api/admin/activation_order', //激活订单
    finish_order: 'POST /api/admin/finish_order', //完成订单
    add_star_order: 'POST /api/admin/add_star_order', //添加星标订单
    send_deliver_goods_notice: 'POST /api/admin/send_deliver_goods_notice', //发货通知
    manual_payment: 'POST /api/admin/manual_payment', //手动支付
    order_cancle: 'POST /api/admin/order_cancle', //取消订单
    add_edit_memo: 'POST /api/admin/add_edit_memo', //添加修改备注
    get_customer_and_address: 'POST /api/admin/get_customer_and_address', //添加修改备注
    get_customer_carts: 'POST /api/admin/get_customer_carts', //通过邮箱获取用户购物车

    save_order: 'POST /api/admin/save_order', //添加、保存订单
    get_marked_deliver_goods_list: 'POST /api/admin/get_marked_deliver_goods_list', //获取标记发货列表



    get_countrys_list: 'POST /api/admin/get_countrys_list', //添加、保存订单
    get_zones_list: 'POST /api/admin/get_zones_list', //添加、保存订单


    // 用户


    get_member_list_pager: `POST ${process.env['APP_HOST_URL_API_USER']}/api/auth/get_member_list_pager.json`, //用户列表
    get_member: process.env['APP_HOST_URL_API_USER'] + '/api/auth/get_member.json', //获取单个用户数据
    add_member: process.env['APP_HOST_URL_API_USER'] + '/api/auth/add_member.json', //添加用户
    edit_member: process.env['APP_HOST_URL_API_USER'] + '/api/auth/edit_member.json', //编辑用户
    delete_member: process.env['APP_HOST_URL_API_USER'] + '/api/auth/delete_member.json', //删除用户

    delete_role: process.env['APP_HOST_URL_API_USER'] + '/api/auth/delete_role.json', //删除角色

    get_role_list_pager: process.env['APP_HOST_URL_API_USER'] + '/api/auth/get_role_list_pager.json', //获取角色


    get_geo_zones_pager: 'POST /api/admin/get_geo_zones_pager', //获取物流信息列表

    get_geo_zone: 'POST /api/admin/get_geo_zone', //获取物流详情
    get_countrys_list: 'POST /api/admin/get_countrys_list', //获取配送地址
    save_geo_zone: 'POST /api/admin/save_geo_zone', //添加修改物流方式
    get_geo_zone_weight_price_table: 'POST /api/admin/get_geo_zone_weight_price_table', //物流计算方式
    geo_zone_del: '/api/admin/geo_zone_del', //物流删除



    // 客服
    get_live_chat_list_pager: 'POST /api/admin/get_live_chat_list_pager', //获取客服列表
    add_live_chat: 'POST /api/admin/add_live_chat', //添加客服
    edit_live_chat: 'POST /api/admin/edit_live_chat', //编辑客服
    delete_live_chat: 'POST /api/admin/delete_live_chat', //删除客服


    //文章分类
    get_bottom_column_list: 'POST /api/admin/get_bottom_column_list', //底部栏目列表分类接口
    get_bottom_column_posts_list: 'POST /api/admin/get_bottom_column_posts_list', //底部栏目列表接口
    del_bottom_column: 'POST /api/admin/del_bottom_column', //底部栏目删除接口


    //  语言
    get_languages_pager: 'POST /api/admin/get_languages_pager', //语言列表

    get_currencys_pager: 'POST /api/admin/get_currencys_pager', //货币列表
    currency_del: 'POST /api/admin/currency_del', //删除货币
    get_mail_setting_pager: 'POST /api/admin/get_mail_setting_pager', //邮件列表
    mail_setting_del: 'POST /api/admin/mail_setting_del', //删除邮件
    
    get_menu_list: 'POST /api/admin/get_menu_list', //获取菜单列表
    get_collection_pager: 'POST /api/admin/get_collection_pager', //商品主题列表
    get_collection_associated_products_pager: 'POST /api/admin/get_collection_associated_products_pager', //获取关联商品列表
    
    remove_collection_associated_products: 'POST /api/admin/remove_collection_associated_products', //获取关联商品删除
    collection_del: 'POST /api/admin/collection_del', //获取关联商品删除
    
    get_myapp_list: 'POST /api/admin/get_myapp_list', //获取支付列表
    
    get_coupons_pager: 'POST /api/admin/get_coupons_pager', //获取优惠卷列表
    coupon_del: 'POST /api/admin/coupon_del', //删除优惠卷列表
    get_full_mall_activity_pager: 'POST /api/admin/get_full_mall_activity_pager', //获取全场活动列表
    clear_front_cache: 'POST /api/admin/clear_front_cache', //删除缓存

    auth_delete_menu: 'POST /api/auth/delete_menu.json', //功能菜单删除

    get_role_member_menus: 'POST /api/auth/get_role_member_menus.json', //获取所有权限

    get_menu_list_pager: 'POST /api/auth/get_menu_list_pager.json', 

    
}