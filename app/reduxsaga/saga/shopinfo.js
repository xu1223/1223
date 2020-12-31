import { SHOP_ADD_IMG,SHOP_DELE_IMG } from '../action/shopinfo';
export const shopAddImgAsync = (datas) => {
    console.log(datas,'datas')
    return {
        type: SHOP_ADD_IMG,
        imagsAll: datas,
    }
};
export const shopdeleImgAsync = (datas) => {
    return {
        type: SHOP_DELE_IMG,
        imagsAll: datas,
    }
}