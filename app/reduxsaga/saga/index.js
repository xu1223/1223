
import { takeLatest, takeEvery } from 'redux-saga/effects';
import { SHOP_ADD_IMG,SHOP_DELE_IMG } from '../action/shopinfo';
import {shopAddImgAsync,shopdeleImgAsync} from './shopinfo';
export default function* rootSaga() {
  yield [
    takeLatest(SHOP_ADD_IMG, shopAddImgAsync),
    takeLatest(SHOP_DELE_IMG, shopdeleImgAsync),
  ];
}