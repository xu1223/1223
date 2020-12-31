export const FormFields = {
  id: "", //	int	是/否	商品id,修改商品内容必填
  tag_ids: "",
  name: "", //	string	否	商品名称
  description: "", //	string	否	内容
  tags: "", //	string	否	标签
  meta_title: "", //	string	否	SEO title
  meta_keyword: "", //	string	否	SEO keyword
  meta_description: "", //	string	否	SEO description
  template_suffix: "", //	string	否	模板后缀
  sku: "", //	string	否	商品sku
  model: "", //spu
  vendor: "", //	string	否	供应商
  color: "", //	string	否	颜色
  upc: "", //	string	否	库存量单位
  material: "", //	string	否	材质
  ean: "", //	string	否	EAN码
  size: "", //	string	否	尺寸
  jan: "", //	string	否	JAN码
  isbn: "", //	string	否	国际标准书号
  published_scope: "", //	string	否	发布渠道 [global,web]
  stock_policy: "", //	string	否	缺货是否可下单 [deny]
  quantity: "", //	string	否	库存
  stock_status: "", //	string	否	库存状态 [In Stock]
  source: "", //	string	否	商品来源
  weight: "", //	string	否	重量
  minimum: "", //	string	否	最小量
  review_rating: "", //	string	否	评价星级
  url: "", //	string	否	自定义链接
  click: "", //	string	否	访问次数
  show_price: "", //	float	否	实际售价格
  price: "", //	string	float	商品价格
  sort_order: "", //	int	否	排序
  is_featured: "", //	int	否	推荐
  is_hot: "", //	int	否	热卖
  is_out: "", //	int	否	清仓
  is_launch: "", //	int	否	是否投放 [1:已投放]
  is_publish: "", //	int	否	是否发布到平台 [0:下架,1:上架,2:待上架]
  is_special: "", //	int	否	特价
  is_new: "", //	int	否	新品
  is_big: "", //	int	否	大卖
  status: "1", //	int	否	状态 [0:禁用 1:启用]
  category_ids: "", //	string	否	分类id集,多个以逗号分隔
  related_id: "", //	string	否	商品关联id集,多个以逗号分隔
  product_option: "", //	json	否	规格数据 product_option product_option_value 
  images: "", //	json	否	图片集
  related_product: "", //	string	否	关联商品,多个以逗号分隔
  wholesale_settings: "", //json 批发设置
  size_chart: "", //json 尺码

};
export const FormFieldsName = {
  id: "id", //	int	是/否	商品id,修改商品内容必填
  name: "name", //	string	否	商品名称
  option_value_name:'option_value_name',
  description: "description", //	string	否	内容
  product_searches: "tag_ids", //	string	否	标签
  meta_title: "meta_title", //	string	否	SEO title
  meta_keyword: "meta_keyword", //	string	否	SEO keyword
  meta_description: "meta_description", //	string	否	SEO description
  template_suffix: "template_suffix", //	string	否	模板后缀
  sku: "sku", //	string	否	商品sku
  model: "model", //
  vendor: "vendor", //	string	否	供应商
  color: "color", //	string	否	颜色
  upc: "upc", //	string	否	库存量单位
  material: "material", //	string	否	材质
  ean: "ean", //	string	否	EAN码
  size: "size", //	string	否	尺寸
  jan: "jan", //	string	否	JAN码
  isbn: "isbn", //	string	否	国际标准书号
  published_scope: "published_scope", //	string	否	发布渠道 [global,web]
  stock_policy: "stock_policy", //	string	否	缺货是否可下单 [deny]
  quantity: "quantity", //	string	否	库存
  stock_status: "stock_status", //	string	否	库存状态 [In Stock]
  source: "source", //	string	否	商品来源
  weight: "weight", //	string	否	重量
  minimum: "minimum", //	string	否	最小量
  review_rating: "review_rating", //	string	否	评价星级
  url: "url", //	string	否	自定义链接
  click: "click", //	string	否	访问次数
  show_price: "show_price", //	float	否	实际售价格
  price: "price", //	string	float	商品价格
  sort_order: "sort_order", //	int	否	排序
  is_featured: "is_featured", //	int	否	推荐
  //     is_featured	int	否	推荐 [0:否,1:是]
  // is_hot	int	否	热卖 [0:否,1:是]
  // is_special	int	否	特价 [0:否,1:是]
  // is_new	int	否	新品 [0:否,1:是]
  // is_big	int	否	大卖 [0:否,1:是]
  // is_out	int	否	清仓 [0:否,1:是]
  is_out: "is_out", //	int	否	清仓
  is_hot: "is_hot", //	int	否	清仓
  is_launch: "is_launch", //	int	否	是否投放 [1:已投放]
  is_publish: "is_publish", //	int	否	是否发布到平台 [0:下架,1:上架,2:待上架]
  is_special: "is_special", //	int	否	特价
  is_new: "is_new", //	int	否	新品
  is_big: "is_big", //	int	否	大卖
  status: "status", //	int	否	状态 [0:禁用 1:启用]
  category_ids: "category_ids", //	string	否	分类id集,多个以逗号分隔
  related_id: "related_id", //	string	否	商品关联id集,多个以逗号分隔
  product_option: "product_option", //	json	否	规格数据 product_option product_option_value
  images: "images", //	json	否	图片集
  related_product: "related_product", //	string	否	关联商品,多个以逗号分隔
  wholesale_settings: "wholesale_settings", //json 批发设置
  customer_group_id: "customer_group_id", //会员等级ID
  purchase_number_min: "purchase_number_min", //购买数量-最小值
  purchase_number_max: "purchase_number_max", //购买数量-最大值
  selling_price: "selling_price", //市场价
  date_start: "date_start", //开始日期
  date_end: "date_end", //结束日期
  size_chart: "size_chart", //json 尺码
};
export const FormFieldsMesg = {
  option_value_name:'',
  name: "商品名称不能为空", //	string	否	商品名称
  description: "", //	string	否	内容
  tags: "请选择标签", //	string	否	标签
  meta_title: "", //	string	否	SEO title
  meta_keyword: "", //	string	否	SEO keyword
  meta_description: "", //	string	否	SEO description
  template_suffix: "", //	string	否	模板后缀
  model: "spu不能为空", //	string	否	商品sku
  sku: "sku不能为空", //	string	否	商品sku
  vendor: "", //	string	否	供应商
  color: "", //	string	否	颜色
  upc: "", //	string	否	库存量单位
  material: "材质不能为空", //	string	否	材质
  ean: "", //	string	否	EAN码
  size: "", //	string	否	尺寸
  jan: "", //	string	否	JAN码
  isbn: "", //	string	否	国际标准书号
  published_scope: "", //	string	否	发布渠道 [global,web]
  stock_policy: "", //	string	否	缺货是否可下单 [deny]
  quantity: "", //	string	否	库存
  stock_status: "", //	string	否	库存状态 [In Stock]
  source: "", //	string	否	商品来源
  weight: "重量不能为空", //	string	否	重量
  minimum: "", //	string	否	最小量
  review_rating: "", //	string	否	评价星级
  url: "", //	string	否	自定义链接
  click: "", //	string	否	访问次数
  show_price: "实际售价格不能为空", //	float	否	实际售价格
  price: "商品价格不能为空", //	string	float	商品价格
  sort_order: "", //	int	否	排序
  is_featured: "", //	int	否	推荐
  is_hot: "0", //	int	否	热卖
  is_out: "0", //	int	否	清仓
  is_launch: "0", //	int	否	是否投放 [1:已投放]
  is_publish: "1", //	int	否	是否发布到平台 [0:下架,1:上架,2:待上架]
  is_special: "0", //	int	否	特价
  is_new: "0", //	int	否	新品
  is_big: "0", //	int	否	大卖
  is_new: "0", //	int	否	subtract
  status: "", //	int	否	状态 [0:禁用 1:启用]
  category_ids: "请选择商品分类", //	string	否	分类id集,多个以逗号分隔
  related_id: "", //	string	否	商品关联id集,多个以逗号分隔
  product_option: "", //	json	否	规格数据
  images: "", //	json	否	图片集
  related_product: "", //	string	否	关联商品,多个以逗号分隔
  wholesale_settings: "", //json 批发设置,
  size_chart: "", //json尺码
};
export const FormFieldsAttrNameKey = {
    attr_color_: '',
    attr_name_: '',
    attr_option_value_name_: '',
    attr_zsku_: '',
    attr_price_: '',
    attr_show_price_: '',
    attr_quantity_: '',
    attr_weight_: '',
    attr_sort_order_: '',
    attr_status_: '',
}
export const FormFieldsAttrName = {
  id: "attr_id_",
  option_id: 'attr_option_id_',
  option_value_id: 'attr_option_value_id_',
  color: "attr_color_",
  option_value_name: "attr_option_value_name_",
  name: "attr_name_",
  zsku: "attr_zsku_",
  price: "attr_price_",
  show_price: "attr_show_price_",
  weight: "attr_weight_",
  quantity: "attr_quantity_",
  sort_order: "attr_sort_order_",
  status: 'attr_status_'
};

export const FormFieldsArrName = {
  id: "id",
  option_id: 'option_id',
  color: "color",
  name: "name",
  zsku: "zsku",
  price: "price",
  show_price: "show_price",
  weight: "weight",
  quantity: "quantity",
  sort_order: "sort_order",
  status: 'status',
  option_value_id: 'option_value_id',
};


export const FormFieldsSettingsNameKey = {
  whole_id_: '',
  whole_product_id_: '',
  whole_customer_group_id_: '',
  whole_purchase_number_min_: '',
  whole_purchase_number_max_: '',
  whole_date_start_: '',
  whole_date_end_: '',
  whole_selling_price_: '',
}
export const FormFieldsSettingsName = {
  id: 'whole_id_',
  product_id: 'whole_product_id_',
  customer_group_id: 'whole_customer_group_id_',
  purchase_number_min: "whole_purchase_number_min_",
  purchase_number_max: 'whole_purchase_number_max_',
  date_start: 'whole_date_start_',
  date_end: "whole_date_end_",
  selling_price: 'whole_selling_price_'
};
export const FormFieldsSettingsArrName = {
  id: 'id',
  product_id: 'product_id',
  customer_group_id: 'customer_group_id',
  purchase_number_min: 'purchase_number_min',
  purchase_number_max: 'purchase_number_max',
  date_start: 'date_start',
  date_end: 'date_end',
  selling_price: 'selling_price'
};
//规格属性 key
export const _ComAttrSpecKey = {
  'Size':'Size',
  'Color':'Color'
}