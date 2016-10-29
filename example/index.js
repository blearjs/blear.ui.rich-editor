/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var RichEditor = require('../src/index');

var re = new RichEditor({
    el: '#demo',
    toolb2ar: 'bold italic underline strikethrough | forecolor removeformat | bullist numlist | ' +
    ' alignleft aligncenter alignright alignjustify | image hr | fullscreen undo redo'
});

re.on('upload', function (fileEl, imgs, done) {
    done('https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png');
});

re.ready(function () {

});

