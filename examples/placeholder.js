/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var RichEditor = require('../src/index');
var schema = require('../src/schemes/writing');

new RichEditor({
    el: '#demo',
    schema: schema,
    placeholder: '点击开始你的写作...'
});
