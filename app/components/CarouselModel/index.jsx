import React, {
    Component
} from 'react';
import { Carousel, Icon } from 'antd';
import './index.less';
export default class CarouselModel extends Component {
    constructor(props, context) {
        super(props, context);
    }
    componentDidMount() { }
    onCancel = () => {
        this.props.showCarouse()
    }
    render() {
        const {
            carouseData,
            visbleCarouse
        } = this.props;

        return (
            <div className="carousel-content">
                <div className="carousel-box">
                    <Carousel ref="welcome">

                        {

                            carouseData.map(item => {
                                return (
                                    <div>
                                        <img src={item.publish_image || item} alt="" />
                                    </div>
                                )
                            })
                        }
                    </Carousel>
                    {carouseData.length > 1 ? <span className="iconBtn btnPrev" onClick={() => { this.refs.welcome.prev() }}><Icon type="left" style={{ fontSize: 28 }} /></span> : null}
                    {carouseData.length > 1 ? <span className="iconBtn btnNext" onClick={() => { this.refs.welcome.next() }}><Icon type="right" style={{ fontSize: 28 }} /></span> : null}
                </div>
                <div className="carousel-design-model" onClick={() => this.onCancel()}></div>
            </div>
        )
    }

}