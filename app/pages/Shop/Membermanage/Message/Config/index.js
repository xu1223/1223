export default {
    toolConfig: {
        "list": {
            action: "get_receive_message_pager",
        },
    },
};

export const TabApi = {
    draft: 'get_draft_message_pager',
    receive: 'get_receive_message_pager',
    sent: 'get_sent_message_pager',

}
export const tabConfig = [{
	id: "receive",
	name: "收件箱",
	icon: 'shop_ziyuan17'
}, {
	id: "sent",
	name: "发件箱",
	icon: 'shop_ziyuan17'
	
}, {
	id: "draft",
	name: "草稿箱",
	icon: 'shop_ziyuan22'
}];