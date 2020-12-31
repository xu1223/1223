import React from 'react';
import {
    Icon
} from 'antd';
import './index.less'
class LocationModular extends React.Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            activeKey:this.props.navList[0].key,
        }
        
        this.scroll = this.handleScroll.bind(this,this.props.navList)
    }

    componentDidMount() {
        window.addEventListener('scroll',this.scroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scroll);
    }

    //滚动事件监听
    handleScroll = (navList) => {
        if(this.state.isClick) return;
        const that = this;
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop, //当前滚动条高度
            scrollHeight = document.body.scrollHeight, //滚动条最大高度
            clientHeight = document.documentElement.clientHeight, //页面编辑区高度
            BottomHeight = scrollHeight - clientHeight; //滚动条可滚动的最大高度
           
        navList.map((item) => {
            const anchorElement = document.getElementById(item.key);
            let top = 0;
            if(anchorElement)
                top = anchorElement.offsetTop;
            if (top + 50 > scrollTop && top - 50 < scrollTop)
                that.setState({
                    activeKey: item.key
                })
        })
        if (scrollTop < 50)
            that.setState({
                activeKey: navList[0].key
            })
        if (scrollTop + 20 > BottomHeight)
            that.setState({
                activeKey: navList[navList.length - 1].key
            })
      
    };
    //滚动到元素位置
    scrollToID = (id)=>{
        let anchorElement = document.getElementById(id);
        const that = this;
        this.setState({
            activeKey:id,
            isClick:true
        });
        if (anchorElement) {
            const top = anchorElement.offsetTop;  // 元素滚动高度
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop,  //当前滚动条高度
                scrollHeight = document.body.scrollHeight, //滚动条最大高度
                clientHeight = document.documentElement.clientHeight, //页面编辑区高度
                BottomHeight = scrollHeight - clientHeight;  // 滚动条可滚动的最大高度
            if(scrollTop > top){
                let timer = null;
                cancelAnimationFrame(timer);
                timer = requestAnimationFrame(function fn(){
                    let oTop = document.body.scrollTop || document.documentElement.scrollTop;
                    if(oTop > top){
                        let Differ = oTop - top;
                        let len = 50;
                        if(Differ < 50)
                            len = Differ;
                        document.body.scrollTop = document.documentElement.scrollTop = oTop - len;
                        timer = requestAnimationFrame(fn);
                    }else{
                        cancelAnimationFrame(timer);
                        that.setState({isClick:false})
                    }
                });
            }else{
                let timer = null;
                cancelAnimationFrame(timer);
                timer = requestAnimationFrame(function fn(){
                    let oTop = document.body.scrollTop || document.documentElement.scrollTop;
                    if(oTop < top && oTop != BottomHeight ){
                        let Differ = top - oTop;
                        let len = 50;
                        if(Differ < 50)
                            len = Differ;
                        document.body.scrollTop = document.documentElement.scrollTop = oTop + len;
                        timer = requestAnimationFrame(fn);
                    }else{
                        cancelAnimationFrame(timer);
                        that.setState({isClick:false})
                    }
                });
            }
        }
    }

    render() {
    
        return (
            <div className="anchor-class">
                <ul>
                    {
                        this.props.navList.map(item=>{
                            return (
                                <li key={item.key}>
                                    <p className={this.state.activeKey === item.key ? "anchor-item active":"anchor-item"}
                                       onClick={this.scrollToID.bind(this,item.key)}>
                                       <span className="iconBox"><Icon type="pushpin" theme="filled" /></span>
                                       <span className="txtNav">{item.title}</span>
                                    </p>
                                </li>)
                        })
                    }
                </ul>
            </div>
        )
    }
}
export default LocationModular