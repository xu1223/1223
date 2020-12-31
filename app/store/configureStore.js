
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga';

// 持久化
import { persistReducer, persistStore } from 'redux-persist'
import reconciler from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native

import sagaReducer from '../sagas/reducers/index'
import rootSaga from '../sagas/tunnel';
import reduxsaga from '../reduxsaga/store';
const config = {
	key: 'root',
	storage,
	stateReconciler: reconciler, //合并模式
	debug: false,
	whitelist: ['user','resetpwd']
};

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
	persistReducer(config, combineReducers({ ...sagaReducer,...reduxsaga})),
	window.devToolsExtension ? window.devToolsExtension() : undefined,
	applyMiddleware(thunk, sagaMiddleware)
);
const persist = persistStore(store)
sagaMiddleware.run(rootSaga)

export default {
    store,
    persist
}
