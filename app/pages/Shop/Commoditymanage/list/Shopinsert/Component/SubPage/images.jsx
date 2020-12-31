import React, { Component } from "react";
import dropIcon from '@/static/img/drop-icon.png';
class Images extends Component {
    constructor(props){
        super(props)
    }
    render(){
        const {imagsAll = []} = this.props
        return(
            <div className="ul">
            {imagsAll.map((v, index) => {
                return (
                  <div
                    className="t-imgcenter li"
                    key={index}
                    draggable="true"
                    onDragOver={(e) => e.preventDefault()}
                    onDragStart={(e) => this.props.dragStart(e, index)}
                    onDrop={(e) => this.props.dragDrop(e, index, v)}
                    data-id={v.id || index}
                  >
                    <i className="iconfont shop_ziyuan17 icon-del" onClick={() => this.props.imgDel(index, v)}></i>
                    {index === 0 ? (
                      <div class="tag-main">
                        <span>主图</span>
                      </div>
                    ) : (
                        ""
                      )}
                    {index === 1 ? (
                      <div class="tag-main">
                        <span>翻转</span>
                      </div>
                    ) : (
                        ""
                      )}
                    <img src={v.base_img|| v.img_m || v.image} onClick={(e) => this.props.imgShow(e, v, index)} />
                    <div class="img-drop-item" style={{ background: `url(${dropIcon})  50% no-repeat #108ee9` }}></div>
                  </div>
                );
              })}
          </div>
        )
    }
}

export default Images