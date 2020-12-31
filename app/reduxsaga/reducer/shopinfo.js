import Immutable from 'immutable';
import { SHOP_ADD_IMG,SHOP_DELE_IMG } from '../action/shopinfo';
const initialState = {
  imagsAll:[]
}
export const shopinfo = (state = initialState, action = {}) => {
  console.log(state,action,'action_1')
  switch (action.type) {
    case SHOP_ADD_IMG: {
      return {
        imagsAll: [...action.imagsAll]
      };
    }
    case SHOP_DELE_IMG: {
      return {
        imagsAll: [...action.imagsAll]
      };
    }
    default:
      return state
  }
};