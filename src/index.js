/**
 * blear.ui.rich-editor
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';


var UI = require('blear.ui');
var selector = require('blear.core.selector');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');
var compatible = require('blear.utils.compatible');

var tinymce = require('./tinymce/index.js');
var w = window;
var File = w[compatible.js('File', w)];

/**
 * 解析事件携带的 files
 * @param eve
 * @param items
 * @param filter
 * @returns {Array}
 */
var parseEventOfFiles = function (eve, items, filter) {
    var files = [];

    if (!typeis.Function(filter)) {
        filter = defaultFilter;
    }

    dato.each(items, function (index, item) {
        if (!item) {
            return;
        }

        if (item.constructor === File) {
            if (item && filter(item)) {
                files.push(item);
            }
        }

        if (item.kind === 'file') {
            var file = item.getAsFile();

            if (file && filter(file)) {
                files.push(file);
            }
        }
    });

    return files;
};

/**
 * 解析事件内携带的文件
 * @param eve
 * @param ele
 * @returns {Array}
 */
var parseFiles = function (eve, ele) {
    eve = eve.originalEvent || eve;

    var filter = function (file) {
        return /^image\//.test(file.type);
    };

    if (eve.dataTransfer && eve.dataTransfer.items) {
        return parseEventOfFiles(eve, eve.dataTransfer && eve.dataTransfer.items, filter);
    } else if (eve.clipboardData && eve.clipboardData.items) {
        return parseEventOfFiles(eve, eve.clipboardData && eve.clipboardData.items, filter);
    } else if (ele.files) {
        return parseEventOfFiles(eve, ele.files, filter);
    } else if (ele.value) {
        return [null];
    }

    return [];
};

var defaults = {
    el: '',
    // 内容样式
    contentStyle: require('./style.css'),
    height: 300,
    maxHeight: 800,
    placeholder: '<p style="color:#888">点击开始输入</p>',
    fileName: 'file',
    fileLabel: '请选择图片'
};
var RichEditor = UI.extend({
    className: 'RichEditor',
    constructor: function (options) {
        var the = this;

        options = the[_options] = object.assign({}, defaults, options);
        the[_textareaEl] = selector.query(options.el)[0];
        the[_initNode]();
        the[_initEvent]();
    },


    /**
     * 获取 html 内容
     * @returns {*|String}
     */
    getHTML: function () {
        return this[_richEditor].getContent();
    },


    /**
     * 设置 html 内容
     * @param html
     * @returns {RichEditor}
     */
    setHTML: function (html) {
        var the = this;
        the[_richEditor].setContent(html);
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
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        the[_richEditor].destroy(false);
        the[_richEditor] = null;
    }
});
var _options = RichEditor.sole();
var _textareaEl = RichEditor.sole();
var _initNode = RichEditor.sole();
var _initEvent = RichEditor.sole();
var _richEditor = RichEditor.sole();
var pro = RichEditor.prototype;

pro[_initNode] = function () {
    var the = this;
    var options = the[_options];
    var textareaEl = the[_textareaEl];

    the[_richEditor] = tinymce.init({
        ele: textareaEl,
        content_style: options.contentStyle,
        // 转换 url 为相对路径
        relative_urls: false,
        // 移除 url 的 host
        remove_script_host: false,
        height: options.height,
        min_height: options.minHeight,
        max_height: options.maxHeight,
        placeholder: options.placeholder,
        uploadFileName: options.fileName,
        uploadFileLabel: options.fileLabel,
        file_picker_callback: function (callback, value, meta, fileEl) {
            fileEl.onchange = function (eve) {
                eve = eve || window.event;
                var imgs = parseFiles(eve, fileEl);

                if (!imgs.length) {
                    return;
                }

                the.emit('upload', fileEl, imgs, function (img) {
                    if (typeis.String(img)) {
                        img = {
                            src: img
                        };
                    }

                    img.src = img.src || img.url;
                    object.assign(meta, img);
                    callback(img.src, meta);
                });
            };
        }
    });
};

pro[_initEvent] = function () {
    var the = this;
    var events = ['upload'];

    array.each(events, function (index, event) {
        the[_richEditor].on(event, function (args) {
            args.unshift(event);
            the.emit.apply(the, args);
        });
    });
};

RichEditor.defaults = defaults;
module.exports = RichEditor;