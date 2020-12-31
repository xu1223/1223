import React, { Component } from 'react';
import {
    Rate
} from 'antd';

class single extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }
    componentDidMount() {
    }
    // 展示数据
    render() {
        const {
            data,
            type
        } = this.props
        let price = data ? data.price : ''
        price = Math.floor(price * 100) / 100

        return <div className="single">
            <img src={data.img_m}></img>
            {
                data ? <div className="single-rihgt">
                    <p>{data.name}</p>
                    <ul style={{ padding: '0' }}>
                        {
                            !type ? <li>
                                <span>SPU:</span>{data.spu}
                            </li> : ""
                        }
                        <li>
                            <span>SKU:</span>{data.sku}
                        </li>
                        {
                            type ? <li>
                                <span>评分:</span><Rate disabled defaultValue={type.rating} />
                            </li> : ""
                        }          {
                            type ? <li>
                                <span>内容:</span>{data.description ? data.description : ''}
                            </li> : ""
                        }
                        {
                            !type ? <li>
                                <span>分类:</span>{data.categories ? data.categories.child_category_name : ''}
                            </li> : ""
                        }
                        {
                            !type ? <li>
                                <span>价格:</span><em>{price}</em>
                            </li> : ""
                        }
                    </ul>
                </div> : ''
            }

        </div>
    }
}

export default single