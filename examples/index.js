/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var RichEditor = require('../src/index');


document.getElementById('start').onclick = function () {
    var re = new RichEditor({
        el: '#demo',
        toolb2ar: 'bold italic underline strikethrough | forecolor removeformat | bullist numlist | ' +
            ' alignleft aligncenter alignright alignjustify | image hr | fullscreen undo redo',
        elementPath: false
    });

// re.setHTML('<p>100元，只要 100 块<br>20012dqw</p><p>这是栋罗马风格浓烈的欧式建筑。\n 如何评价 Clean Code 作者对 Swift 与 Kotlin 的看法？<br></p>');
//
// re.on('upload', function (fileEl, imgs, done) {
//     done('https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png');
// });
//
// re.ready(function () {
//
// });
//
// re.on('wordCount', function (count) {
//     console.log('wordCount', count);
// });

};

