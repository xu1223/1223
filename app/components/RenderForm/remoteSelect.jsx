import React from 'react'
import { Select, Spin, Tooltip, Icon, Row, Col } from 'antd';
import debounce from 'lodash/debounce';
import { post, get } from 'fetch/request';
const { Option } = Select;

export default class RemoteSelect extends React.Component {
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                value: nextProps.value || nextProps.platform == 16 ? '' : {},
                // data: nextProps.data || []
            }
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
    }

    state = {
        data: [],
        fetching: false,
    };

    fetchUser = value => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        const { requestParams = {} } = this.props;
        const {
            url = "/erp/publish/joom/previewColor",
            requestKey = "keyword",
            ...otherParams
        } = Object.assign({}, requestParams);

        otherParams[requestKey] = value;

        this.setState({ data: [], fetching: true });

        get(url, { ...otherParams }).then(res => {
            if (fetchId !== this.lastFetchId) {
                return;
            }
            let remoteData = !!res.resultData.data.list ? res.resultData.data.list : res.resultData.data;
            this.setState({ data: (otherParams.platform == 16) ? [{ name: "No Brand" }, ...remoteData] : remoteData, fetching: false });
        });
    };

    handleChange = value => {
        this.props.onChange(value)
        this.setState({
            // data: [],
            fetching: false,
        });
    };

    render() {
        const { fetching, data } = this.state;
        const {
            formConf,
            requestParams = {},
            unicode = ''
        } = this.props;
        let dyKey = []
        if (!!unicode) {
            dyKey = unicode.split('|')
        }
        return (
            <Row type='flex'>
                <Col span={22}>
                    <Select
                        allowClear
                        {...formConf}
                        value={this.props.value}
                        notFoundContent={fetching ? <Spin size="small" /> : null}
                        filterOption={false}
                        showSearch={true}
                        onSearch={this.fetchUser}
                        onChange={this.handleChange}
                        style={{ width: '100%' }}
                    >
                        {(data && data instanceof Array && data.length > 0 ? data : []).map(d => (
                            <Option key={d.value || d.brand_id} value={d[dyKey[0]] || d.name || d.value}>{ d[dyKey[1]] || d.label || d.name}</Option>
                        ))}
                    </Select>
                </Col>
                <Col span={2}>
                    {requestParams && requestParams.platform == 2 ?
                        <Tooltip title="无品牌时，请输入None">
                            <Icon style={{ color: '#8FC78A', fontSize: '20px', marginLeft: '10px' }} type="question-circle" theme="filled" />
                        </Tooltip> : null}
                </Col>
            </Row>

        )
    }
}