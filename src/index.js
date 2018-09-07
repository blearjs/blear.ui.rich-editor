/**
 * blear.ui.rich-editor
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 * @update 2018年09月05日17:30:47
 */

'use strict';


var UI = require('blear.ui');
var selector = require('blear.core.selector');
var object = require('blear.utils.object');
var modification = require('blear.core.modification');

require('../tinymce/index');
require('../tinymce/themes/modern/index');
require('../tinymce/skins/lightgray/index');
require('../tinymce/langs/zh_CN');
require('../tinymce/plugins/autoresize/index');
require('../tinymce/plugins/wordcount/index');
require('../tinymce/plugins/placeholder/index');

var tinymce = window.tinymce;
var defaults = {
    el: '',
    // 方案
    schema: null,
    // 内容样式
    contentStyle: require('./style.css'),
    height: 300,
    maxHeight: 800,
    placeholder: '点击开始输入',
    uploadFiledName: 'file',
    /**
     * 显示元素路径
     * @type Boolean
     */
    elementPath: true,
    resize: true,
    toolbar: [
        'bold'
    ],
    imageUploadHandler: function (inputEl, callback) {
        callback(new Error('未配置图片选择上传'));
    },
    imagePasteHandler: function (blob, callback) {
        callback(new Error('未配置图片粘贴上传'));
    }
};
var RichEditor = UI.extend({
    className: 'RichEditor',
    constructor: function (options) {
        var the = this;
        var schema = options.schema;
        delete options.schema;

        options = the[_options] = object.assign({}, defaults, schema, options);
        var appendContentCSS = options.appendContentCSS;

        if (appendContentCSS) {
            options.contentStyle += appendContentCSS;
        }

        RichEditor.parent(the);
        the[_textareaEl] = selector.query(options.el)[0];
        the[_initNode]();
        the[_initEvent]();
        the[_readied] = false;
        the[_callbacks] = [];
    },

    /**
     * 获取 html 内容
     * @returns {*|String}
     */
    getHTML: function () {
        return this[_richEditor].getContent({
            raw: 'html'
        });
    },

    /**
     * 设置 html 内容
     * @param html
     * @returns {RichEditor}
     */
    setHTML: function (html) {
        var the = this;
        the[_richEditor].setContent(html, {
            format: 'raw'
        });
        the[_richEditor].isNotDirty = false;
        return the;
    },

    /**
     * 获取字数
     * @returns {Number}
     */
    getWordCount: function () {
        return this[_richEditor].getWordCount();
    },

    /**
     * 获取内容区域元素
     * @returns {Element}
     */
    getContentEl: function () {
        return this[_richEditor].getBody();
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        the[_richEditor].destroy(false);
        the[_richEditor] = null;
    }
});
var sole = RichEditor.sole;
var _options = sole();
var _textareaEl = sole();
var _initNode = sole();
var _initEvent = sole();
var _richEditor = sole();
var _readied = sole();
var _callbacks = sole();
var prot = RichEditor.prototype;

prot[_initNode] = function () {
    var the = this;
    var options = the[_options];
    var textareaEl = the[_textareaEl];

    the[_richEditor] = tinymce.init({
        preInit: function (editor) {
            var doc = editor.getDoc();
            var dom = editor.dom;
            var styleEl = dom.add(doc.head, 'style');
            editor.appendContentStyle = function (cssText) {
                modification.importStyle(cssText, styleEl, true);
            };
        },
        placeholder: options.placeholder,
        // https://www.tiny.cloud/docs/configure/integration-and-setup/#target
        target: textareaEl,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#branding
        branding: false,
        // // https://www.tiny.cloud/docs/configure/editor-appearance/#color_picker_callback
        // color_picker_callback: function (callback, value) {
        //     callback(value);
        // },
        // https://www.tiny.cloud/docs/configure/editor-appearance/#elementpath
        elementpath: options.elementPath,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#height
        height: options.height,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#min_height
        min_height: options.height,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#max_height
        max_height: options.maxHeight,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#resize
        resize: options.resize,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#statusbar
        statusbar: true,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#menubar
        menubar: false,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#toolbar
        toolbar: options.toolbar,
        // https://www.tiny.cloud/docs/configure/content-appearance/#content_style
        content_style: options.contentStyle,
        // https://www.tiny.cloud/docs/configure/content-formatting/#block_formats
        block_formats: 'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;' +
            'Heading 4=h4;Heading 5=h5;Heading 6=h6;Preformatted=pre',
        // https://www.tiny.cloud/docs/configure/content-formatting/#font_formats
        font_formats: '默认=webdings;宋体=宋体,SimSun;' +
            '微软雅黑=微软雅黑,Microsoft YaHei;' +
            '楷体=楷体,楷体_GB2312,KaiTi_GB2312,SimKai;' +
            '黑体=黑体,SimHei;' +
            '隶书=隶书,SimLi;' +
            'Arial=arial,helvetica,sans-serif;' +
            'Times New Roman=Times New Roman',
        // https://www.tiny.cloud/docs/configure/content-formatting/#fontsize_formats
        fontsize_formats: '12px 14px 16px 18px 20px 30px',
        // https://www.tiny.cloud/docs/configure/spelling/#browser_spellcheck
        browser_spellcheck: false,
        // https://www.tiny.cloud/docs/configure/file-image-upload/#file_browser_callback_types
        file_browser_callback_types: 'image',
        // https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_types
        file_picker_types: 'image',
        uploadFiledName: options.uploadFiledName,
        // https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        imageUploadHandler: options.imageUploadHandler,
        // https://www.tiny.cloud/docs/plugins/image/#image_advtab
        image_advtab: false,
        // https://www.tiny.cloud/docs/plugins/contextmenu/
        contextmenu: options.contextMenu,
        // https://www.tiny.cloud/docs/configure/url-handling/#relative_urls
        relative_urls: false,
        // https://www.tiny.cloud/docs/plugins/codesample/#codesample_languages
        codesample_languages: options.codesampleLanguages,
        // https://www.tiny.cloud/docs/plugins/autoresize/#autoresize_bottom_margin
        autoresize_bottom_margin: 1
    });
};

prot[_initEvent] = function () {
    var the = this;

    // the[_richEditor].on('wordCount', function (meta) {
    //     the.emit('wordCount', meta.count);
    // });
};

RichEditor.defaults = defaults;
module.exports = RichEditor;