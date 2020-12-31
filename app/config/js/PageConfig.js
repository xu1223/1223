/**
 * 分页配置
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
const getConfig = (num) => {
	return {
		showTotal: function(total) {
			return `总计 ${total} 条记录`
		},
		current: 1,
		defaultPageSize: num,
		pageSize: num,
		showQuickJumper: true,
		showSizeChanger: true,
		pageSizeOptions: ['20', '50', '100', '200', '500']
	}
}

//分页配置
export const PAGECONF = getConfig(20);

//分页配置: 订单
export const PAGECONF_ORDER = getConfig(100);