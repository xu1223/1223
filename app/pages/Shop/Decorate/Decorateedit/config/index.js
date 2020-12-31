export const iframeinit = function (data) {
    this.lodingstatus(true)
    const {
        strhtml,
        jsArr,
        status = true,
        id = 'container',
        parent_id
    } = data

    var ifamedom = window.frames['decorate'];
    if (!ifamedom.document.getElementById(id) && strhtml) {
        this.lodingstatus(false)
        return
    }
    if (status) {
        if (ifamedom.document.getElementById(id)) {
            console.log(ifamedom.document.getElementById(id).innerHTML, id, '2222222222')
            ifamedom.document.getElementById(id).innerHTML = strhtml
        }
    } else {
        if (ifamedom.document.getElementById(this.state.footer_id)) {
            ifamedom.document.getElementById(this.state.footer_id).insertAdjacentHTML('beforebegin', strhtml)
        }
    }
    // ;
    if (!jsArr) {
        window.frames["decorate"].loadJs()
        this.lodingstatus(false)
        return
    }
    if (parent_id) {
        window.frames["decorate"].move(`-${parent_id}`)
    }
    setTimeout(() => {
        this.lodingstatus(false)
        window.frames["decorate"].indata(jsArr)
    }, 3000)
}
export const htmlinit = function (html, type) {
    if (html) {
        let str = []
        if (!type) {
             str = html.split("<script>")
            if (str[1]) {
                str[1] = str[1].replace('</script>', '')
                str[1] = str[1].replace('</section>', '')
            }
            return str
        }
        str.push(html)
        return str


    }

}
export const htmlinitend = function (html) {
    if (html) {
        let str = []

        return str
    }

}
const stylesetting = {
    'font-size': '字体大小（PX）',
    'color': '颜色',
    'width': '宽度（PX）',
    'height': '高度（PX）',
    'font-weight': '文字粗细（PX）',
    'background-color': '背景颜色',
    'boder': '线条大小（PX）',
    'margin': '外边距（PX）',
    'padding': '内边距（PX）',
    'padding-left': '左内边距（PX）',
    'padding-right': '右内边距（PX）',
    'padding-top': '上内边距（PX）',
    'padding-bottom': '下内边距（PX）',
    'margin-left': '左外边距（PX）',
    'margin-right': '右外边距（PX）',
    'margin-top': '上外边距（PX）',
    'margin-bottom': '下外边距（PX）',
    'border-radius': '边框弧度（PX）',
    'border-width': '边框大小（PX）',
    'border-color': '边框颜色',

}
export const stylepx = ['color', 'background-color', 'font-weight', 'border-color']
export const stylename = function (key, item) {
    let name = item.name_cn
    let keyname = stylesetting[key] || key
    name += keyname
    return name
}