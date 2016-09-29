/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var RichEditor = require('../src/index');

var re = new RichEditor({
    el: '#demo',
    contentStyle: require('./style.css', 'css|text'),
    toolbar: 'bold italic underline strikethrough | forecolor removeformat | bullist numlist | ' +
    ' alignleft aligncenter alignright alignjustify | image hr | fullscreen undo redo'
});

re.ready(function () {

});

