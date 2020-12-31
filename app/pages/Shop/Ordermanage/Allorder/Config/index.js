export default {
    toolConfig: {
        "list": {
            action: "get_orders_pager",
            params: {
                order_status: ' '
            }
        },
    },
};




export const tabConfig = [{
	id: "",
	name: "全部订单",
	icon: 'shop_ziyuan21'
}, {
	id: "unpaid",
	name: "未付款",
	icon: 'shop_ziyuan17'
	
}, {
	id: "paid",
	name: "已付款",
	icon: 'shop_ziyuan22'
}, {
	id: "shipped",
	name: "已发货",
	icon: 'shop_ziyuan22'
}, {
	id: "canceled",
	name: "已取消",
	icon: 'shop_ziyuan22'
}, {
	id: "completed",
	name: "已完成",
	icon: 'shop_ziyuan22'
}];