import React, {Component} from 'react';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import {reqUpdateImg} from '../../api'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from "prop-types";

export default class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props);
        const html = this.props.detail
        let editorState = ''
        if (html) {
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                editorState = EditorState.createWithContent(contentState);
            }
        } else {
            editorState = EditorState.createEmpty()
        }
        this.state = {
            editorState,
        }
    }

    state = {
        editorState: EditorState.createEmpty(),
    }


    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }

    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url
                    resolve({data: {link: url}});
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }


    getDetail = () => {
        const {editorState} = this.state;
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }

    render() {
        const {editorState} = this.state;
        return (

            <Editor
                editorState={editorState}
                editorStyle={{border: '1px solid black', minHeight: 200, padding: '0 10px'}}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: {uploadCallback: this.uploadImageCallBack},
                }}
            />

        )
    }
}
