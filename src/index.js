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
var fun = require('blear.utils.function');

var tinymce = require('./tinymce/index.js');
var parseEventFiles = require('./parse-event-files');


var defaults = {
    el: '',
    // 内容样式
    contentStyle: require('./style.css'),
    height: 300,
    maxHeight: 800,
    placeholder: '<p style="color:#888">点击开始输入</p>',
    fileName: 'file',
    fileLabel: '请选择图片',
    elementPath: true
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
     * 编辑器准备完毕回调
     * @param callback
     * @returns {RichEditor}
     */
    ready: function (callback) {
        var the = this;
        callback = fun.noop(callback);

        if (the[_readied]) {
            callback.call(the);
        } else {
            the[_callbacks].push(callback);
        }

        return the;
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
        ele: textareaEl,
        content_style: options.contentStyle,
        // 转换 url 为相对路径
        relative_urls: false,
        // 移除 script 的 host
        remove_script_host: false,
        height: options.height,
        min_height: options.minHeight,
        max_height: options.maxHeight,
        placeholder: options.placeholder,
        uploadFileName: options.fileName,
        uploadFileLabel: options.fileLabel,
        toolbar: options.toolbar,
        elementpath: options.elementPath,
        font_formats: '默认=webdings;宋体=宋体,SimSun;' +
        '微软雅黑=微软雅黑,Microsoft YaHei;' +
        '楷体=楷体,楷体_GB2312,KaiTi_GB2312,SimKai;' +
        '黑体=黑体,SimHei;' +
        '隶书=隶书,SimLi;' +
        'Arial=arial,helvetica,sans-serif;' +
        'Times New Roman=Times New Roman',
        fontsize_formats: '12px 14px 16px 18px 20px 30px',
        file_picker_callback: function (callback, fileEl, meta) {
            fileEl.onchange = function (eve) {
                eve = eve || window.event;
                var imgs = parseEventFiles(eve, fileEl);

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

    fun.until(function () {
        the[_readied] = true;
        array.each(the[_callbacks], function (_, callback) {
            callback.call(the);
        });
        the[_callbacks] = [];
    }, function () {
        return !!the[_richEditor].getDoc();
    });
};

pro[_initEvent] = function () {
    var the = this;

    the[_richEditor].on('wordCount', function (meta) {
        the.emit('wordCount', meta.count);
    });
};

RichEditor.defaults = defaults;
module.exports = RichEditor;