import React, { Component } from 'react';
import { Button, Icon, Popover  } from 'antd';
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errMsg: '' };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, errMsg: info.componentStack });
  }

  refreshPage = () => {
    // 清空search组件用到的缓存信息
    this.props.clearSearchData()
    location.reload()
  }

  render() {
    const { hasError, errMsg } = this.state
    if (hasError) {
      return <div className="waitfor-error" style={{width: '740px'}}>
        <img src='/img/errortip.gif' />
        <div className="waitfor-error-conter waitfor-error-absolute" >
          <b>THE REQUESTED URL WAS NOT FOUND ON THIS SERVER</b>
          <p>功能没有尽头，使用有墙头，这就是404，出错拉！</p>
          <div>
              <Button type="primary" onClick={this.refreshPage} >RETRY</Button> <Popover  content={<div style={{ width: 600 }}>{errMsg}</div>}><Icon className="tipicon" type="exclamation-circle" /></Popover>
          </div>
        </div>
      </div>
    } else if (this.props.initLoading) {
      return <div className="waitfor-error" style={{marginTop:'80px'}}>
      <img src='/img/await.gif' />
      <div className="waitfor-error-conter">
        <b style={{textAlign:'center',marginTop:'40px'}}>系统加载中，请稍微。。。</b>
      </div>
    </div>
    } else {
      return this.props.children;
    }
  }
}