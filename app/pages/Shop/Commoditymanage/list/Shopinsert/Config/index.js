export default {
    toolConfig: {
        "list": {
            action: "get_products_pager",
            params:{}
		},
		"categorys":{
			action:'get_categorys_pager',
			params:{}
		}
    },
};

export const TabsConfig = [{
	id: "1",
	name: "基本信息",
	status:"1",
	key:'1',
	icon: ' iconfont shop_ziyuan13'
}, {
	id: "2",
	name: "商品属性",
	status:"2",
	key:'2',
	icon: 'close-circle'
	
}, {
	id: "3",
	name: "商品图片",
	status:"3",
	key:'3',
	icon: 'check-circle'
}, {
	id: "4",
	name: "SEO设置",
	status:"4",
	key:'4',
	icon: 'check-circle'
}, {
	id: "5",
	name: "商品关联",
	status:"5",
	key:'5',
	icon: 'check-circle'
}, {
	id: "6",
	name: "批发设置",
	status:"6",
	key:'6',
	icon: 'check-circle'
}];