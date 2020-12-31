import React from 'react';
import './index.less';
export default class Ueditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.initEditor();
    }

    componentWillUnmount() {
        // 组件卸载后，清除放入库的id
        UE.delEditor(this.props.id);
    }

    initEditor() {
        const that = this;
        let UE = window.UE;
        const {
            initHeight = 800,
            maximumWords = 10000,
            serverUrl
        } = this.props;
        const {
            id,
            setDisabled
        } = this.props
        let obj = {}
        if (!!serverUrl)
            obj.serverUrl = serverUrl;

        if (id) {
            try {
                UE.delEditor(id);
            } catch (e) {
                console.log(e)
            }
            const ueEditor = UE.getEditor(id, {
                autoHeightEnabled: false, //设置滚动条
                initialFrameHeight: initHeight, //设置最大高度
                autoFloatEnabled: false,
                maximumWords,
                toolbars: [['watermark','|', 
                // 'fullscreen', 
                'source', '|', 'undo', 'redo', '|',
                'bold', 'italic', 'underline', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', /*'selectall', 'cleardoc',*/ '|',
                'rowspacingtop', 'rowspacingbottom', 'lineheight', '|', 'fontsize', '|', 'indent', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', '|',
                'link', 'unlink', /*'anchor'*/, '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                'insertimage', 'preview', '|', 'foreword', 'subhead', 'body', 'caption', 'stress', 'quote'
            ]],
                ...obj
            });

            ueEditor.ready((ueditor) => {
                if (ueditor) {
                    setTimeout(() => {
                        setDisabled && ueEditor.setDisabled();
                        if (this.props.richText == undefined) {
                            ueEditor.setContent('');
                        } else {
                            ueEditor.setContent(this.props.richText);
                        }
                    }, 1000);
                }
            });
        }
    }

    render() {
        return (
            <div id={this.props.id} name="content"></div>
        );
    }
};
