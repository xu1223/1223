import React from 'react';
export default class Ueditor extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                richText: nextProps.value || ''
            }
        }
        return null
    }
    
    componentDidUpdate(nextProps, {richText}) {
        this.setUeContent(this.state.richText)
    }

    componentDidMount() {
        this.ueEditor = this.initEditor();
    }

    componentWillUnmount() {
        UE.delEditor(this.props.id);
    }

    initEditor() {
        const UE = window.UE;
        const {
            initialFrameHeight = 800,
            maximumWords = 10000,
            serverUrl,
            id,
            ueParams = {}
        } = this.props;
        const obj = {}
        if(!!serverUrl)
            obj.serverUrl = serverUrl;

        const ueEditor = UE.getEditor(id, {
            autoHeightEnabled: false, //设置滚动条
            autoFloatEnabled:false,
            maximumWords,
            initialFrameHeight, //设置最大高度
            ...obj,
            ...ueParams
        });

        ueEditor.ready((ueditor) => {
            if (!ueditor) {
                if(id) {
                    UE.delEditor(id);
                }
                this.initEditor();
            }
            ueEditor.addListener('blur', ()=>{
                this.props.onChange(ueEditor.getContent())
            })
            this.ueEditor.setContent(this.state.richText)
        });
        return ueEditor
    }

    setUeContent = (text) => {
        this.ueEditor.setContent(text)
    }
    render() {
        return <div id={this.props.id} name="content"></div>
    }
};
