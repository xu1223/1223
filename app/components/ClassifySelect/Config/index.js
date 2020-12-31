//lazada获取分类参数及返回字段
export const CONFIG = {
    configPub: {
        storeKey: 'store_id',
        nodeKey: 'node_id',
        childKey: 'has_children',
        childArrKey: 'children',
        nodeNameKey: 'node_name'
    },
    //亚马逊获取分类参数及返回字段
    configFbm: {
        storeKey: 'storeId',
        nodeKey: 'nodeId',
        childKey: 'isHasChild',
        childArrKey: 'children',
        nodeNameKey: 'nodeName',
        addId:true,
        parentNodeKey: 'parentNodeId'
    },
    //ebay获取分类参数及返回字段
    configEbay: {
        storeKey: 'store_id',
        nodeKey: 'categoryId',
        childKey: 'leafCategory',
        childArrKey: 'children',
        nodeNameKey: 'categoryName',
        parentNodeKey: 'categoryParentId'
    },
    configSys: {
        storeKey: 'store_id',
        nodeKey: 'cate_id',
        childKey: 'has_children',
        childArrKey: 'children',
        nodeNameKey: 'cate_name'
    },
    configProduct:{
        storeKey: 'store_id',
        nodeKey: 'id',
        childKey: 'comment',
        childArrKey: 'children',
        nodeNameKey: 'cateName'
    }
}
