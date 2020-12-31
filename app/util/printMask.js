import {
    message
} from 'antd';



export function printMask (params = {}){
    const {
        data = {},
        view = false //是否预览
    } = params
    // 是否自定义
    const is_nocustomize = Array.isArray(data) && data[0].type == 'print_png' || data.type == 'print_png'
    if (is_nocustomize) {
        let _pngPrint = [], imageSize = {};
        if(Array.isArray(data)) {
            _pngPrint = data.map(item => item.addresses).join(',').split(',')
            imageSize = JSON.parse(data[0].image_size)[0]
        } else {
            _pngPrint = data.addresses.split(',')
            imageSize = JSON.parse(data.image_size)[0]
        }
        let isFlag = data.sort_flag ? true : false, //isFlag 默认是false  如果需要特殊处理 为 true
            _heightSize = data.size ? data.size : 100,
            ratio = imageSize.height / imageSize.width,
            PageSize = isFlag ? parseInt(_heightSize) : 100 * ratio;

        LODOP.PRINT_INITA(0, 0, '100mm', (100 * ratio + 1.6) + 'mm', '');
        _pngPrint.forEach(item => {
            LODOP.SET_PRINT_PAGESIZE(0, '100mm', (PageSize + 1.6) + 'mm', '');
            LODOP.ADD_PRINT_IMAGE(0, 0, '100mm', 100 * ratio + 'mm', "<img border='0' src='" + item + "'/>");
            LODOP.SET_PRINT_STYLEA(0, "Stretch", 1); //(可变形)扩展缩放模式
            LODOP.NewPageA();
        })
        LODOP.SET_PRINTER_INDEX(-1);
        if (view) {
            LODOP.PREVIEW();
        } else {
            LODOP.PRINT();
        }
    } else {
        if (Array.isArray(data)) {
            data.forEach(item => {
                printData({
                    _data: item
                })
                LODOP.NewPageA();  // 切换下一页
            })
        } else {
            printData({
                _data: data,
            })
        }
        LODOP.SET_PRINTER_INDEX(-1);
        if (view) {
            LODOP.PREVIEW();
        } else {
            LODOP.PRINT();
        }
    }
}

//打印自定义
function printData({_data}) {
    const _content = _data.content;
    var _pWidth = _data.pageW,
        _pHeight = _data.pageH,
        _plimit = _data.product_row;  // 有种自定义面单A4类型 限制 里面表格的显示个数
    LODOP.PRINT_INITA(0, 0, _pWidth + 'mm', _pHeight + 'mm', '');
    LODOP.SET_PRINT_PAGESIZE(0, _pWidth + 'mm', _pHeight + 'mm', '');

    if (_data.molBg && _data.molBg.indexOf("html") == -1) {
        // 增加背景图片  容错 html 背景图 不添加
        LODOP.ADD_PRINT_IMAGE(0, 0, _pWidth + 'px', _pHeight + 'px', "<img src='" + _data.molBg + "'/>");
    }

    for (var i = 0, len = _content.length; i < len; i++) {
        var now = _content[i];
        const codeType = '128B'
        if (["barcode", "barcode_order", "agent_mailno", "temp_order_id", "tracking_no"].includes(now.type)){
            // var codeType = /^[0-9]*$/.test(now.html) ? '128B' : '128B';
            LODOP.ADD_PRINT_BARCODE(now.top, now.left, parseInt(now.width), parseInt(now.height), codeType, now.html);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
            LODOP.SET_PRINT_STYLEA(0, "AlignJustify", 2);
        } else if (now.type == "barcode_zipcode" || now.type == "ywsf_barcode") {
            // var codeType = /^[0-9]*$/.test(now.html) ? '128B' : '128B';
            LODOP.ADD_PRINT_BARCODE(now.top, now.left, parseInt(now.width) + 'px', parseInt(now.height - 6) + 'px', codeType, now.html + " ");
            LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
            var codestr = now.type == "barcode_zipcode" ? "ZIP" + now.html : now.html;
            LODOP.ADD_PRINT_HTM(now.top + now.height - 5, now.left, parseInt(now.width), parseInt(now.height) + 'px', '<div style="font-size:13;line-height:1;word-break:break-all;">' + codestr + '</div>')
        } else {
            if (typeof now.html == "object" && now.html != null) {
                var top = now.top;
                var destArr = now.html;

                if (!!_plimit && _plimit != "0") { //如果有限制的话  使用限制值
                    destArr = now.html.slice(0, _plimit);
                }
                destArr.forEach((item, index) => {
                    var _height = now.height * 2;
                    LODOP.ADD_PRINT_HTM(top, now.left, parseInt(now.width), _height, '<div style="font-size:8;line-height:1;text-align:' + now.textAlign + ';border:' + now.borderWidth + ' solid #000000">' + item + '</div>')
                    top = top + _height - 1;
                })
            } else {
                LODOP.ADD_PRINT_HTM(now.top, now.left, parseInt(now.width), now.height, '<div style="font-size:' + now.fontSize + '; line-height:' + now.lineHeight + ';text-align:' + now.textAlign + ';border:' + now.borderWidth + ' solid #000000; font-weight:' + now.fontWeight + '">' + (now.html == null ? "" : now.html) + '</div>')
            }
        }
    }
}

export default{
    // 菜鸟云打印
    sendCommand(data=[],status, callback){
        if (typeof this.socket == "undefined" || this.socket.readyState == WebSocket.CLOSED) {
            this.doConnect(this.sendCommand, data, status)
            return;
        }
        // if(status) {
        // 	this.callback = callback
        // } else {
        // 	this.callback = null
        // }

        if (this.socket.readyState != WebSocket.OPEN) {
            alert("无效连接: " + this.socket.readyState);
            return;
        }
        let time = new Date().getTime();
        let msg={
            "cmd": "print",
            "requestID": time + 1,
            "version": "1.0",
            "task": {
                "taskID": "7293666",
                "preview": false,
                "printer": "",
                "notifyMode": "allInOne",
                "previewType": "pdf",
                "documents": data
            }
        }

        for (var index = 0; index < data.length; index++) {
            var obj = msg;

            if (obj["task"]) {
                // taskID
                obj["task"]["taskID"] = time.toString() + "_TASK_" + index;

                // preview
                obj["task"]["preview"] = status;
            }

            var newMsg = JSON.stringify(obj);
            // return false;
            this.socket.send(newMsg);
        }
    },

    // WebSocket--链接
    doConnect(callback, data, status){
        this.socket = new WebSocket('ws://localhost:13528');
        // console.log("socket,初始", this.socket)
        var that = this;
        // 监听消息
        this.socket.onmessage = function (event) {
            console.log('Client received a message', event);
            document.getElementById("pdfDiv").style.visibility = "hidden";
            // parse json
            var obj = eval('(' + event.data + ')');
            if (obj && (obj.previewURL || obj.previewImage)) {
                var url;
                if (obj && obj.previewURL) {
                    url = obj.previewURL;
                } else if (obj && obj.previewImage) {
                    url = obj.previewImage;
                }
                var pdf = document.getElementById('pdf');
                if (pdf) {
                    pdf.setAttribute('src', url);
                    document.getElementById("pdfDiv").style.visibility = "visible";
                }
            }
            //	that.gePicInfo(url)
            console.log("event返回消息111", event.data)
        };

        this.socket.onopen =  (event) => {
            that.sendCommand(data, status)
            // if (callback != null) {
            // 	callback.bind(that);
            // }
            message.info("已连接");
        }

        this.socket.onerror = function (error) {
            // console.log("Failed to connect CN print at " + serviceUrl, error);
            message.info("连接错误");
        }

        // 监听Socket的关闭
        this.socket.onclose = function (event) {
            // console.log('Client notified socket has closed', event);
            message.info("连接关闭");
        };
    },

    //data数据构造
    dataStructure(renderData,url){
        const destData = [];
        renderData.forEach(item => {
            const obj = {
                documentID: item.data.waybillCode,
                contents: []
            }
            // item.templateURL = "http://cloudprint.cainiao.com/cloudprint/template/getStandardTemplate.json?template_id=801"
            delete item.data.recipient.phone
            delete item.data.sender.phone
            obj.contents.push(item)
            obj.contents.push({//自定义区部分
                templateURL: !!url ? url : "http://cloudprint.cainiao.com/template/customArea/9004183/4",
                data: item.data.packageInfo.items[0]
            })

            destData.push(obj)
        })
        return destData;
    },
}