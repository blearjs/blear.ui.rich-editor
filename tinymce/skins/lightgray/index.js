/**
 * 文件描述
 * @author ydr.me
 * @create 2018-09-05 19:12
 * @update 2018-09-05 19:12
 */


'use strict';

var string = require('blear.utils.string');

var cssResTxt = require('./css-res.txt', 'css|text');
var cssTxt = string.assign(cssResTxt, {
    fonts: {
        tinymceEot: require('./fonts/tinymce.eot', 'file|url'),
        tinymceSvg: require('./fonts/tinymce.svg', 'file|url'),
        tinymceTtf: require('./fonts/tinymce.ttf', 'file|url'),
        tinymceWoff: require('./fonts/tinymce.woff', 'file|url'),
        tinymceSmallEot: require('./fonts/tinymce-small.eot', 'file|url'),
        tinymceSmallSvg: require('./fonts/tinymce-small.svg', 'file|url'),
        tinymceSmallTtf: require('./fonts/tinymce-small.ttf', 'file|url'),
        tinymceSmallWoff: require('./fonts/tinymce-small.woff', 'file|url')
    },
    imgs: {
        anchor: require('./imgs/anchor.gif', 'file|url'),
        loader: require('./imgs/loader.gif', 'file|url'),
        object: require('./imgs/object.gif', 'file|url'),
        trans: require('./imgs/trans.gif', 'file|url')
    }
});

coolie.importStyle(cssTxt);
require('./skin.css', 'css|style');
require('./content.css', 'css|style');



