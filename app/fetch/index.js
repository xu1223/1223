import {
  post,
  get,
  request
} from './request'
const gogle = process.env['APP_HOST_URL_API_GOGLE'];
export default {
  common: {
    // 公共 - 获取物流面单
    access_token_cache: params => post(process.env['APP_HOST_URL_API_USER'] + '/api/get_access_token_cache.json', params),
   
  },
  order: {
    //获取当前模板列表
    customizelist: params => post('/api/admin/customize/template/list', params),
    //修改模板名称
    edit_template_name: params => post('/api/admin/customize/template/edit_template_name', params),
    //模板发布
    customizepublish: params => post('/api/admin/customize/template/publish', params),
    //复制模板
    customizecopy: params => post('/api/admin/customize/template/copy', params),
    //删除模板
    customizedeletetemplate: params => post('/api/admin/customize/template/delete_template', params),
    //获取模板编辑页面列表
    customizegpages_list: params => post('/api/admin/customize/template/get_pages_list', params),
    //获取编辑页面以及切换编辑页面
    customizetemplate: params => post('/api/admin/customize/template', params),
    //获取可添加模块
    customizegsections: params => post('/api/admin/customize/template/get_template_sections', params),
    //更新模板
    customizegupdate: params => post('/api/admin/customize/template/update', params),
    //保存
    customizegsave: params => post('/api/admin/customize/template/save', params),


    //获取商品专题列表
    product_template_themes_pager: params => post('/api/admin/get_product_template_themes_pager', params),
    //保存商品专题
    save_product_template_theme: params => post('/api/admin/save_product_template_theme', params),
    //编辑商品主题
    edit_product_template_theme: params => post('/api/admin/edit_product_template_theme', params),
    //删除商品专题
    delete_product_template_theme: params => post('/api/admin/delete_product_template_theme', params),
    //批量删除商品专题
    batch_delete_product_template_theme: params => post('/api/admin/batch_delete_product_template_theme', params),
    //批量启用禁用商品专题
    batch_active_product_template_theme: params => post('/api/admin/batch_active_product_template_theme', params),

    //底部栏目增改接口
    save_bottom_column: params => post('/api/admin/save_bottom_column', params),
    sort_order_bottom_column: params => post('/api/admin/sort_order_bottom_column', params),
    publish_bottom_column: params => post('/api/admin/publish_bottom_column', params),

    get_bottom_column: params => post('/api/admin/get_bottom_column', params), //底部详情
    get_bottom_column_list: params => post('/api/admin/get_bottom_column_list', params), // 底部栏目列表
    check_seo_url_unique: params => post('/api/admin/check_seo_url_unique', params), // 验证自定义链接是否唯一

    get_setting_list: params => post('/api/admin/get_setting_list', params), // 基本设置
    save_setting: params => post('/api/admin/save_setting', params), // 保存基本设置


    edit_language_sort_order: params => post('/api/admin/edit_language_sort_order', params), // 语言排序
    language_active: params => post('/api/admin/language_active', params), // 启用和禁用语言

    save_currency: params => post('/api/admin/save_currency', params), // 保存货币
    currency_active: params => post('/api/admin/currency_active', params), // 启用禁用货币
    edit_currency_sort_order: params => post('/api/admin/edit_currency_sort_order', params), // 货币排序
    save_mail_setting: params => post('/api/admin/save_mail_setting', params), // 编辑邮箱
    mail_setting_active: params => post('/api/admin/mail_setting_active', params), // 启用禁用邮箱
    edit_mail_setting_sort_order: params => post('/api/admin/edit_mail_setting_sort_order', params), // 邮箱排序
    get_template_section_detail: params => post('/api/admin/customize/template/get_template_section_detail', params), // 获取模板详情

    get_template_global_settings: params => post('/api/admin/customize/template/get_template_global_settings', params), // 获取全局设置
    edit_template_global_settings: params => post('/api/admin/customize/template/edit_template_global_settings', params), // 获取全局保存

    save_menu: params => post('/api/admin/save_menu', params), // 保存菜单
    edit_menu: params => post('/api/admin/edit_menu', params), // 编辑菜单
    menu_detail: params => post('/api/admin/menu_detail', params), // 菜单详情
    menu_sort_order: params => post('/api/admin/menu_sort_order', params), // 菜单排序
    menu_active: params => post('/api/admin/menu_active', params), // 菜单禁用和解禁
    delete_menu: params => post('/api/admin/delete_menu', params), // 菜单删除
    get_menu_tree: params => post('/api/admin/get_menu_tree', params), // 导航树
    product_theme_list: params => post('/api/admin/product_theme_list', params), // 获取主题列表
    get_categorys_pager: params => post('/api/admin/get_categorys_pager', params), // 获取分类

    save_collection: params => post('/api/admin/save_collection', params), // 保存商品主题
    edit_collection: params => post('/api/admin/edit_collection', params), // 编辑商品主题
    sort_order_collection: params => post('/api/admin/sort_order_collection', params), // 商品主题排序
    collection_del: params => post('/api/admin/collection_del', params), // 商品主题删除
    sort_collection_associated_products: params => post('/api/admin/sort_collection_associated_products', params), // 关联商品排序
    remove_collection_associated_products: params => post('/api/admin/remove_collection_associated_products', params), // 删除关联商品
    add_collection_associated_products: params => post('/api/admin/add_collection_associated_products', params), // 添加关联商品

    bind_domain: params => post('/api/admin/bind_domain', params), // 主域名绑定
    manager_domain: params => post('/api/admin/manager_domain', params), // 域名管理
    open_https: params => post('/api/admin/open_https', params), // 开启https
    edit_free_domain: params => post('/api/admin/edit_free_domain', params), // 修改免费域名
    redirect_main_domain: params => post('/api/admin/redirect_main_domain', params), // 修改免费域名
    set_products_sort_order: params => post('/api/admin/set_products_sort_order', params), // 修改商城列表

    sort_order_search: params => post('/api/admin/sort_order_search', params), // 修改商品标签排序
    set_app_enable_disable: params => post('/api/admin/set_app_enable_disable', params), // 修改支付状态
    set_app_sort_order: params => post('/api/admin/set_app_sort_order', params), // 修改支付排序
    edit_myapp: params => post('/api/admin/edit_myapp', params), // 修改支付配置

    get_collection_pager: params => post('/api/admin/get_collection_pager.json', params), // 获取员工

    edit_payment_description: params => post('/api/admin/edit_payment_description', params), // 编辑支付描述
    set_coupon_status: params => post('/api/admin/set_coupon_status', params), // 设置优惠券状态  status 0:禁用 1:启用
    get_tree_category_simple: params => post('/api/admin/get_tree_category_simple', params), // 获取分类树
    save_coupon: params => post('/api/admin/save_coupon', params), // 获取优惠卷吗保存
    set_full_mall_activity_status: params => post('/api/admin/set_full_mall_activity_status', params), // 全场活动状态
    save_full_mall_activity: params => post('/api/admin/save_full_mall_activity', params), // 全场活动保存
    set_coupon_sort_order: params => post('/api/admin/set_coupon_sort_order', params), // 优惠卷排序
    

    edit_role: params => post('/api/auth/edit_role.json', params), // 修改角色排序
    add_role: params => post('/api/auth/add_role.json', params), // 添加角色
    batch_edit_role: params => post('/api/auth/batch_edit_role.json', params), // 批量修改权限状态
    

    get_menu_list_pager: params => post('/api/auth/get_menu_list_pager.json', params), // 功能菜单列表
    add_menu: params => post('/api/auth/add_menu.json', params), // 功能菜单添加
    auth_edit_menu: params => post('/api/auth/edit_menu.json', params), // 功能菜单编辑
    auth_delete_menu: params => post('/api/auth/delete_menu.json', params), // 功能菜单删除
    get_role_member_menus: params => post('/api/auth/get_role_member_menus.json', params), // 获取所有权限


    
  },
  product: {

  },

  gogleApi:{
    goglelinkId: params => get( gogle+'/metadata/ga/columns', params),
  }


}