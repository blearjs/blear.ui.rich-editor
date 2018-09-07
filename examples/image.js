/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var RichEditor = require('../src/index');
var schema = require('../src/scenes/writing');

new RichEditor({
    el: '#demo',
    schema: schema,
    placeholder: '点击开始你的写作...',
    imageUploadHandler: function (inputEl, callback) {
        setTimeout(function () {
            callback(null, {
                src: 'https://cdn.bdqkl-inc.com/screenshot/20180906082851.png',
                alt: '静夜思'
            });
        }, 1500);
    },
    imagePasteHandler: function (inputEl, callback) {
        setTimeout(function () {
            callback(null, {
                src: 'https://cdn.bdqkl-inc.com/screenshot/20180906082851.png',
                alt: '静夜思'
            });
        }, 1500);
    }
});
