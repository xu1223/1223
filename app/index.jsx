import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { hashHistory } from 'react-router'
import { PersistGate } from 'redux-persist/es/integration/react';
import RouteMap from './router/routeMap'
import storeConfig from './store/configureStore'
import HocWinLink from 'components/hocWinLink'
const {store , persist} = storeConfig //获取store 和 缓存配置
window.$store = store;
window.HocWinLink = HocWinLink //挂载到全局对象
import './static/css/index.less'
// import './index.js'
render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persist}>
			<RouteMap history={hashHistory} />
		</PersistGate>
	</Provider>,
	document.getElementById('root')
)
