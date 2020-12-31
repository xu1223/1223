import React from 'react'
import {
  connect
} from 'react-redux'
import {
  is,
  fromJS
} from 'immutable';
import {
  Tabs,
  Row,
  Col
} from 'antd'
const { TabPane } = Tabs;

import {
  bindActionCreators
} from 'redux'
import * as userAction from 'sagas/user'

import './index.less'

function mapStateToProps(state) {
  return {
    menu: state.user.menu
  }
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(userAction, dispatch)
  }
}
function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}
@connect(mapStateToProps, mapDispatchToProps, mergeProps, {
  withRef: true
})
export default class Bread extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }

  // 点击切换导航
  onChange = activeKey => {
    const [active, type] = activeKey.split('$')
    const rowData = this.getRow(active, type)
    this.props.goLink(rowData.url, rowData)
  }

  // TODO 这里要改
  getRow = (activeKey, type) => {
    return this.props.menu.breadData.find(item => {
      let flag = false
      if (item.index == activeKey) {
        flag = true
        if (item.type != type) {
          flag = false
        }
      }
      return flag
    })
  }

  /**
   * activeKey  当前要删除掉项
   * isClose  是否属于关闭删除 关闭删除要走 routes  后退
   */
  remove = (activeKey, isClose) => {
    const {
      breadData: oldBreadData
    } = this.props.menu

    if (oldBreadData.length == 1) {
      return false;
    }

    const { routes = [], router } = this.props

    if (routes.length > 1 && isClose) {
      // 如果路由 数组有存在 则 走回退的流程
      router.goBack()
      // let routerItem = routes[routes.length - 1]
      this.props.setBread({
        breadData: oldBreadData && oldBreadData.filter(item => {
          const {url} = item
          const _pathname = typeof url == 'object' ? url.pathname : url
          return _pathname != activeKey
        })
      }) //重置面包屑的内容
    } else {
      let _destIndex = 0
      const breadData = []
      oldBreadData.forEach((item, _index) => {
        if (this.getKey(item.index, item.type) != activeKey) {
          breadData.push(item)
        } else {
          _destIndex = _index - 1
        }
      });
      // 获取 他旁边的index
      if (_destIndex < 0) {
        _destIndex = 0
      } else if (_destIndex > breadData.length - 1) {
        _destIndex = breadData.length - 1
      }
      const destRow = breadData[_destIndex]
      this.props.goLink(destRow.url, destRow) //跳转 到指定的url
      this.props.setBread({ breadData }) //重置面包屑的内容
    }
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  getKey = (index, type) => {
    return `${index}${!!type ? '$' + type : ''}`
  }

  render() {
    const {
      menu: {
        breadData = [],
        curSecMenu,
        curType
      }
    } = this.props;
    return (
      !!breadData.length && <Tabs
        hideAdd
        onChange={this.onChange}
        activeKey={this.getKey(curSecMenu, curType)}
        type="editable-card"
        className="bread-nav"
        onEdit={this.onEdit}
      >
        {
          breadData.map(pane => (
            <TabPane tab={pane.title} key={this.getKey(pane.index, pane.type)}></TabPane>
          ))
        }
      </Tabs>)
  }
}
