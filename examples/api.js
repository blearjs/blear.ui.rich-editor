/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var RichEditor = require('../src/index');
var scene = require('../src/scenes/writing');

var containerEl = document.getElementById('container');
var bind = function (sel, fun) {
    document.getElementById(sel).onclick = fun;
};

var re = new RichEditor({
    el: '#demo',
    scene: scene,
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


bind('getHTML', function () {
    alert(re.getHTML());
});

bind('getText', function () {
    alert(re.getText());
});

bind('setHTML', function () {
    re.setHTML(
        '<p>重新设置了内容：<b>' + new Date().toLocaleString() + '</b></p>'
    );
});

bind('insertHTML', function () {
    re.insertHTML(
        '插入的内容：<b>' + new Date().toLocaleString() + '</b>'
    );
});

bind('getWordCount', function () {
    alert(re.getWordCount());
});

bind('getContentEl', function () {
    console.log(re.getContentEl());
});

bind('command', function () {
    re.command('bold');
});

bind('focus', function () {
    re.focus();
});

bind('loadingTrue', function () {
    re.loading(true);
});

bind('loadingFalse', function () {
    re.loading(false);
});

bind('destroy', function () {
    re.destroy();
});

bind('remove', function () {
    re.detach();
    document.body.removeChild(containerEl);
});

bind('restore', function () {
    document.body.appendChild(containerEl);
    re.attach();
});
