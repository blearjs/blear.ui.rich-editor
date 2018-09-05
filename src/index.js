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
var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');
var fun = require('blear.utils.function');

require('./tinymce/index');
require('./tinymce/themes/modern/index');
require('./tinymce/skins/lightgray/index');
require('./tinymce/langs/zh_CN');

var tinymce = window.tinymce;
var defaults = {
    el: '',
    // 内容样式
    contentStyle: require('./style.css'),
    height: 300,
    maxHeight: 800,
    placeholder: '<p style="color:#888">点击开始输入</p>',
    fileName: 'file',
    fileLabel: '请选择图片',
    /**
     * 显示元素路径
     * @type Boolean
     */
    elementPath: true,
    menus: {
        file: {title: 'File', items: 'newdocument'},
        edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
        insert: {title: 'Insert', items: 'link media | template hr'},
        view: {title: 'View', items: 'visualaid'},
        format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
        table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
        tools: {title: 'Tools', items: 'spellchecker code'}
    },
    resize: true,
    toolbar: 'undo redo | styleselect | bold italic | link image'
};
var RichEditor = UI.extend({
    className: 'RichEditor',
    constructor: function (options) {
        var the = this;

        options = the[_options] = object.assign({}, defaults, options);
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
var pro = RichEditor.prototype;

pro[_initNode] = function () {
    var the = this;
    var options = the[_options];
    var textareaEl = the[_textareaEl];

    the[_richEditor] = tinymce.init({
        // https://www.tiny.cloud/docs/configure/integration-and-setup/#target
        target: textareaEl,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#branding
        branding: false,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#color_picker_callback
        color_picker_callback: function (callback, value) {
            callback(value);
        },
        // https://www.tiny.cloud/docs/configure/editor-appearance/#elementpath
        elementpath: options.elementPath,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#height
        height: options.height,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#min_height
        min_height: options.height,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#max_height
        max_height: options.maxHeight,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#menu
        menu: options.menus,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#resize
        resize: options.resize,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#statusbar
        statusbar: true,
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
        // https://www.tiny.cloud/docs/configure/file-image-upload/#file_browser_callback
        file_browser_callback: function (filed, url, type, win) {

        },
        // https://www.tiny.cloud/docs/configure/file-image-upload/#file_browser_callback_types
        file_browser_callback_types: 'image',
        // https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_types
        file_picker_types: 'image',
        // https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_callback
        file_picker_callback: function (callback, value, meta) {
            // callback('myimage.jpg', {alt: 'My alt text'});
        },
        // https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: function (blob, success, failure) {
            failure('未配置文件上传');
        }
    });
};

pro[_initEvent] = function () {
    var the = this;

    // the[_richEditor].on('wordCount', function (meta) {
    //     the.emit('wordCount', meta.count);
    // });
};

RichEditor.defaults = defaults;
module.exports = RichEditor;