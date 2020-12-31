import React from 'react'
export default class extends React.Component{
        beforeClick = e => {
            const {
                beforeJump = () => {}
            } = this.props;
            if(beforeJump() !== undefined){
                e.preventDefault()
            }
        }
        changeUrl = url => {
            let _url = url.indexOf('#') > -1?url:url.split('/')[0]? '#/' + url:'#' + url
            _url = _url + (_url.indexOf('?') > -1?'&':'?') +`hash=${location.hash.split('#/')[1]}`
            return _url
        }
        render(){ 
            const {
                children,
                url
            } = this.props;
            return <a href={this.changeUrl(url) || '#'} target='_blank' onClick={this.beforeClick}>
                {children}
            </a>
        }
}