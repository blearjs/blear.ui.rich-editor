/**
 * blear.ui.rich-editor
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 * @update 2018年09月05日17:30:47
 */

'use strict';


var UI = require('blear.ui');
var selector = require('blear.core.selector');
var access = require('blear.utils.access');
var object = require('blear.utils.object');
var typeis = require('blear.utils.typeis');
var loader = require('blear.utils.loader');
var modification = require('blear.core.modification');

require('../tinymce/index');
require('../tinymce/themes/modern/index');
require('../tinymce/skins/lightgray/index');
require('../tinymce/langs/zh_CN');
require('../tinymce/plugins/autoresize/index');
require('../tinymce/plugins/placeholder/index');
require('../tinymce/plugins/paste/index');
require('../tinymce/plugins/wordcount/index');

var tinymce = window.tinymce;
var EditorManager = tinymce.EditorManager;
var defaults = {
    el: '',
    // 场景
    scene: null,
    // 内容样式
    contentCSS: require('./style.css'),
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
    pasteValidstyles: 'none',
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
        var scene = options.scene;
        delete options.scene;

        options = the[_options] = object.assign({}, defaults, scene, options);
        var appendContentCSS = options.appendContentCSS;

        if (appendContentCSS) {
            options.contentCSS += appendContentCSS;
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
            format: 'html'
        });
    },

    /**
     * 获取 text 内容
     * @returns {*|String}
     */
    getText: function () {
        return this[_richEditor].getContent({
            format: 'text'
        });
    },

    /**
     * 设置 html 内容
     * @param html
     * @returns {RichEditor}
     */
    setHTML: function (html) {
        this[_richEditor].setContent(html, {
            format: 'raw'
        });
        this[_richEditor].selection.select(this[_richEditor].getBody(), true);
        this[_richEditor].selection.collapse(false);
        return this;
    },

    /**
     * 当前位置插入 HTML
     * @param html
     * @returns {RichEditor}
     */
    insertHTML: function (html) {
        this[_richEditor].insertContent(html);
        return this;
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
     * 执行命令
     * @param cmd {string}
     * @returns {RichEditor}
     */
    command: function (cmd) {
        this[_richEditor].execCommand(cmd, false);
        return this;
    },

    /**
     * 聚焦
     * @param cmd
     * @returns {RichEditor}
     */
    focus: function (cmd) {
        this[_richEditor].focus();
        return this;
    },

    /**
     * 设置/取消 loading 状态
     * @param bool {boolean}
     * @returns {RichEditor}
     */
    loading: function (bool) {
        this[_richEditor].setProgressState(bool);
        return this;
    },

    /**
     * 追加内容 css 样式
     * @param cssText {string}
     * @returns {RichEditor}
     */
    appendContentCSS: function (cssText) {
        this[_richEditor].appendContentCSS(cssText);
        return this;
    },

    /**
     * 编辑器分离
     * @ref https://stackoverflow.com/a/4655467
     * @returns {RichEditor}
     */
    detach: function () {
        EditorManager.execCommand('mceRemoveEditor', true, this[_richEditorId]);
        return this;
    },

    /**
     * 结合
     * @returns {RichEditor}
     */
    attach: function () {
        EditorManager.execCommand('mceAddEditor', true, this[_richEditorId]);
        this[_richEditor] = EditorManager.get(this[_richEditorId]);
        return this;
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
var _richEditorId = sole();
var _readied = sole();
var _callbacks = sole();
var prot = RichEditor.prototype;

prot[_initNode] = function () {
    var the = this;
    var options = the[_options];
    var textareaEl = the[_textareaEl];
    var overrideHandler = function (handler) {
        return function () {
            var args = access.args(arguments);
            var latestIndex = args.length - 1;
            var callback = args[latestIndex];

            args[latestIndex] = function (err, meta) {
                if (err) {
                    return callback(err);
                }

                if (typeis.String(meta)) {
                    meta = {
                        src: meta
                    };
                }

                loader.img(meta.src, function () {
                    callback(null, meta);
                });
            };
            handler.apply(null, args);
        };
    };

    the[_richEditor] = tinymce.init({
        preInit: function (editor) {
            var doc = editor.getDoc();
            var dom = editor.dom;
            var styleEl = dom.add(doc.head, 'style');
            editor.appendContentCSS = function (cssText) {
                modification.importStyle(cssText, styleEl, true);
            };
        },
        placeholder: options.placeholder,
        // https://www.tiny.cloud/docs/configure/integration-and-setup/#target
        target: textareaEl,
        // https://www.tiny.cloud/docs/configure/editor-appearance/#branding
        branding: false,
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
        content_style: options.contentCSS,
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
        imageUploadHandler: overrideHandler(options.imageUploadHandler),
        imagePasteHandler: overrideHandler(options.imagePasteHandler),
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
    the[_richEditorId] = the[_richEditor].id;
};

prot[_initEvent] = function () {
    var the = this;

    // the[_richEditor].on('wordCount', function (meta) {
    //     the.emit('wordCount', meta.count);
    // });
};

RichEditor.defaults = defaults;
module.exports = RichEditor;