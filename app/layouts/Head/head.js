import React from 'react';

const hasPowerData = ['lazada', 'daraz', 'coupang', 'ebay', 'amazon', 'joom','cdiscount','shopee','wish','aliexpress','vova','alibaba','my'];  //拥有 权限的 平台

// 处理各模块导航 上部和下部数据
function getDataByType(data, mode) {
    let listArr = [], bottomArr = []
    if (mode == 'sale' || mode == 'order' || mode == 'logistics') {
        // 刊登平台 和订单 要特殊处理
        data.forEach(item => {
            if (item.index.indexOf('Publish') != -1 || (mode == 'order' && !['OrderSet'].includes(item.index)) || mode == 'logistics') {
                listArr.push(item)
            } else {
                bottomArr.push(item)
            }           
        });
    } else {
        listArr = data.filter(item => item)
    }
    return {
        listArr,
        bottomArr
    }
}

// 获取导航列表数据
function getListArr(data, mode, bottomArr) {
    let arr = [];
	
	arr = arr.map((item, index) => {
	    return <div key={'float' + index} style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>{item}</div>
	})
	arr.push(returnModeMenuList.call(this, data, mode, bottomArr))   //装子菜单数据，将子菜单分成每块6个子子菜单的几个块
	
    return {
        list: arr,
    }
}

// 获取列表数据
function getListData(data, mode) {
    const {listArr, bottomArr} = getDataByType(data, mode) //获取头部和底部
    const {pice, list} = getListArr.call(this, listArr, mode, bottomArr)
    const _bottomArr = getBottomArr.call(this, bottomArr, mode)
    return {
        bottomArr : _bottomArr,
        listArr: list,
        pice
    }
}

// 获取导航数据
export function getNavList() {
    const { menuVisible, menudata=[],erpMenuActive} = this.state;
    const arr = [];
    // let index = menuData.findIndex(item => item.id == 530)
    // if(index != -1){
    //     menuData.unshift(menuData[index])
    //     menuData.splice(index + 1,1)
    // }
    menudata.map(item => {
        const iarr = [] //得到123级标题
        const { children } = item
        if (children && children.length) {
            const {pice, bottomArr, listArr} = getListData.call(this, children, item.index)
            iarr.push(item.name)
            menuVisible && iarr.push(
                <div key={item.index + "erptab"} className="erp-tab-mian" style={{ width: 'calc(100vw - 40px)' }}>
                    {listArr}
                    {bottomArr}
                </div>
            )
                let isOpenClass = erpMenuActive == item.index ? ' active' : ''
                arr.push(<li key={item.index} className={getCurNavCls.call(this, item) + isOpenClass} onClick={() => onOpenClass.call(this,item.index)}>{iarr}</li>)
        }
    })
    return arr
}

function getItemStr(name, mode, hasChild, _item) {
    name = name.indexOf('_') > -1 ? name.split('_')[1] : name
    let _logo = <span className='menu-tit-span'>{name}</span>
    if (mode == 'sale') {
        _logo = <img src={`${name}.jpg`} />
    }
    return <div key={_item.index + 'tit'} className={hasChild ? "tab-title" : "tab-title no-child-mod"}>{_logo} <div className="menu-xian"></div></div>
} 

/**
* list  分隔的表格数据
* modalName  大模块的名称
*/
function returnModeMenuList(list, modalName, bottomArr) {
    const { curSecMenu, curMname } = this.props.menu
    const arr = []
    list && list.map((_item, _index) => {
        const _arr = [], __arr = [] //得到23级标题
        const { children, name } = _item
        const hasChild = children && children.length
        const isPower = modalName == 'Publish' ? hasPowerData.includes(_item.name.toLowerCase()) : true // 是否有权限
                        __arr.push(<a
                            key={_item.index}
                            onClick={() => navSet.call(this, _item, modalName, name)}
                            className={_item.index == curSecMenu && curMname == name ? 'cur' : ''}
                        >{_item.name}</a>)
      
        //两个className用来判断当前的菜单是否有权限的 ||  第一个或后面判断当前模块是否处于对接中
        let contertClassName = !isPower ? "tab-contert-div  no-auth-div" : "tab-contert-div";
        _arr.push(<div key={_item.index + 'li'} className={'tab-list'}>{__arr}</div>)
        arr.push(<div key={_item.index} className={contertClassName}>{_arr}</div>)
    })
    return arr
}

function getBottomArr(data, modalName) {
    const { curSecMenu } = this.props.menu
    return <div className="buttom-menu">
        { 
            data.map(item => {
                return <div key={item.index + 'bottom'} className='tab-buttom-menu' onClick={() => navSet.call(this, item, modalName)} >
                    <img src={`${item.index}.png`} />
                    <span className={item.index == curSecMenu ? 'cur' : ''}>{item.name}</span>
                </div>
            }) 
        }
    </div>
}

function navSet (item, curMenu, platform) {
    let href = window.location.origin+'/#/'+item.index
    window.open(href)

    return
    if (!platform) {
        if(curMenu == 'Publish') {
            if (this.props.menu.curSecMenu.indexOf('Publish') != -1) {
                platform = this.props.menu.curSecMenu
            } else {
                if (this.props.menu.curMname) {
                    platform = this.props.menu.curMname
                } else {
                    platform = hasPowerData[0]
                    platform = platform.charAt(0).toUpperCase() + platform.slice(1)
                }
            }
        }
    }
    const curSecMenu = item.index
    this.setTimeAni()  // 执行动画
    const arr = [ curSecMenu ]
    if (curMenu == 'sale' ) {
        arr.push(getPlatId(this.props.local.platData, platform))
    } else if (curMenu == 'order') {
        if (curSecMenu == 'OrderPackage' || curSecMenu == 'OrderList') {
            arr.push(platform.split('_')[0])
        }
    }else if (curMenu == 'logistics') {
        if (curSecMenu == 'AeOnlineLogisticsOrder') {
            arr.push(platform.split('_')[0])
        }
    }
   console.log(item.name,curMenu,platform,'===============')
    this.props.goLink(`/${arr.join('/')}`, {
        title: item.name,
        parent: curMenu,
        curMname: platform
    })
}

function getPlatId(platData, platform) {
    const _platItem = platData.find(item => item.name.toLowerCase() == platform.toLowerCase())
    return _platItem ? _platItem.id : ''
}

function getCurNavCls(item){
    const { menuVisible } = this.state
    const { curMenu } = this.props.menu
    const arr = ['erp-tab-a']
    if(!menuVisible) {
        arr.push('hide')
    }
    if(curMenu == item.index){
        arr.push('cur')
    }
    return arr.join(' ')
}


/**
 * @desc 打开或关闭下拉分类筛选
 * @param {*} e 
 * @param {string} menuKey 模块key
 */
function onOpenClass(menuKey){
    const {
        erpMenuActive
    } = this.state
    this.setState({
        erpMenuActive: erpMenuActive == menuKey ? '' : menuKey
    })
}