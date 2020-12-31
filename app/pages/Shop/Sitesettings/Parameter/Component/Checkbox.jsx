import React, {
    Component
} from 'react';
import {
    Button,
    Checkbox, Input
} from 'antd';
const { Search } = Input;
import { ListContext } from '@/config/context'
import { FixedSizeGrid as Grid } from 'react-window';
export default class Tool extends Component {

    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            checkedList: []
        }
        this.Searchvalue = ''
    }
    componentDidMount() {
        this.indata()
    }

    componentDidUpdate() {

    }
    // 选择单个
    onChangegroup = (checkedList, name) => {
        this.setState({
            checkedList,
        });

        this.props.allcheckdata(checkedList, name)
    };

    componentDidUpdate() {
        const {
            Searchvalue
        } = this.state
        if (Searchvalue != this.Searchvalue) {
            this.Searchvalue = Searchvalue
            this.indata()
        }
    }
    indata() {
        const {
            platformNameList = [],
            name
        } = this.props
        const {
            checkedList = [],
            Searchvalue = ''
        } = this.state
        let len = checkedList.length
        let checkhtml = platformNameList.map((item) => {
            let code = item.name_cn || item.lang_name
            if (item.is_shield == 1 && len == 0) {
                checkedList.push(item.id + '')
            }

            if (code.indexOf(Searchvalue) != -1) {
                if (Searchvalue) {
                    return <Checkbox value={`${item.id}`}><span style={{ color: 'rgb(255, 0, 0)' }}>{code}</span></Checkbox>
                } else {
                    return <Checkbox value={`${item.id}`}>{code}</Checkbox>
                }
            }

        })
        if (checkhtml) {
            checkhtml = checkhtml.filter(item => item);
        }
        this.props.allcheckdata(checkedList, name)
        this.setState({
            checkhtml,
            checkedList
        })
    }


    reset() {
        this.setState({
            Searchvalue: ''
        })
    }
    onSearch = (value) => {
        this.setState({
            Searchvalue: value
        })
    }
    render() {
        const {
            name

        } = this.props
        let {
            checkhtml = [],
            checkedList = [],
            Searchvalue = ''
        } = this.state
        const Row1 = ({ rowIndex, columnIndex, isScrolling, style, data }) => (

            <div style={style}>
                {
                    data[((rowIndex * 3) + columnIndex)]
                }
            </div>
        );
        return (
            checkhtml.length > 0 ? <div>
                <div style={{ display: 'flex', marginBottom: '20px', width: '500px' }}>
                    <Search placeholder="请输入搜索的名称" onSearch={value => this.onSearch(value)} enterButton />
                    <Button style={{ marginLeft: '10px' }} onClick={() => this.reset()}>重置</Button>
                </div>
                <div>
                    <Checkbox.Group value={checkedList}
                        onChange={(e) => this.onChangegroup(e, name)}>
                        <Grid
                            columnCount={3}
                            columnWidth={330}
                            height={150}
                            rowCount={checkhtml.length}
                            rowHeight={35}
                            width={1010}
                            itemData={checkhtml}
                        >

                            {Row1}
                        </Grid>
                    </Checkbox.Group>
                </div>
            </div> : ''


        )
    }
}