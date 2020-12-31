import React from 'react'
import { Menu, Layout } from 'antd'
const { Sider } = Layout;
const MenuItem = Menu.Item;
export default class Bread extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      activeKey: ''
    }
  }

  componentDidMount() {}

  // 点击切换导航
  onChange = ({ key }) => {
    this.setState({ activeKey: key });
    this.props.onChange(key)
  }

  render() {
    const {
      TabsConfig = []
    } = this.props
    return (
      <Sider breakpoint='xxl'>
        <Menu
            onClick={this.onChange}
            selectedKeys={[this.state.activeKey]}
        >
            {
                TabsConfig.map((item) => <MenuItem key={item.status}><img className="icon-svg" src={`/img/iconfont_svg/storage/${item.icon}.svg`} alt="" />{item.name}</MenuItem>)
            }
        </Menu>
      </Sider>
      
    )
  }
}
