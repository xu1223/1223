import React, {
    Component
} from 'react';
import { Popover } from 'antd';
import './index.less';
import currentSrc from '@/static/img/current.png';
export default class showImageModal extends Component {
    static defaultProps = {
        visibleTip: true
    }
    state = {
    }
    constructor(props, context) {
        super(props, context);

    }
    componentDidMount() { }

    //显示大图
    showImageModal = (visible) => {
        if (!!this.props.src) {
            this.setState({
                [visible]: true
            })
        }

    }
    //关闭大图
    hideImageModalMouse = (visible) => {
        this.setState({
            [visible]: false
        })
    }
    render() {
        const {
            src,
            visible,
            tip,
            visibleTip,
            visbleCarouse,
            showCarouse,
            position
        } = this.props;
        let _right = {
            right: '110%',
            left: 'initial'
        }
        return (
            <div className="showImgBox" style={{ marginTop: 10 }}
                onMouseEnter={() => this.showImageModal(visible)}
                onMouseLeave={() => this.hideImageModalMouse(visible)}>
                <Popover placement="rightTop" title={null} content={
                    (<div className='show showBgImg'>
                        <img src={src ? src : currentSrc} alt="" />
                    </div>)
                } trigger="hover">
                    <img src={src ? src : currentSrc} className="showSmImg" onClick={src ? showCarouse : ''} />
                </Popover>
                {tip && visibleTip ? <span className="tip">{tip}</span> : null}

            </div>
        )
    }

}