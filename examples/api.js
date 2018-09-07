/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var RichEditor = require('../src/index');

var containerEl = document.getElementById('container');
var bind = function (sel, fun) {
    document.getElementById(sel).onclick = fun;
};

var re = new RichEditor({
    el: '#demo'
});

bind('getHTML', function () {
    alert(re.getHTML());
});

bind('getText', function () {
    alert(re.getText());
});

bind('setHTML', function () {
    re.setHTML(
        '<p>重新设置了内容：<b>' + new Date().toLocaleString() + '</b>。</p>'
    );
});

bind('insertHTML', function () {
    re.insertHTML(
        '插入的内容：<b>' + new Date().toLocaleString() + '</b>。'
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

bind('focusEnd', function () {
    re.focus(true);
});

bind('loadingTrue', function () {
    re.loading(true);
});

bind('loadingFalse', function () {
    re.loading(false);
});

bind('empty', function () {
    re.empty();
});

bind('isEmpty', function () {
    alert('编辑器内容' + (re.isEmpty() ? '【是】' : '【不】') + '为空');
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
