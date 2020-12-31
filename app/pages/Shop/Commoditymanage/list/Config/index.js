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
	id: "",
	name: "全部商品",
	icon: 'exclamation-circle'
}, {
	id: "0",
	name: "已下架",
	icon: 'close-circle'
	
}, {
	id: "1",
	name: "已上架",
	icon: 'check-circle'
}];