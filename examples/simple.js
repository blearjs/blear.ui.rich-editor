/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var RichEditor = require('../src/index');
var scene = require('../src/scenes/simple');

new RichEditor({
    el: '#demo',
    scene: scene
});
