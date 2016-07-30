/**
 * 文件描述
 * @author ydr.me
 * @create 2016-07-30 10:02
 */


'use strict';

var typeis = require('blear.utils.typeis');
var compatible = require('blear.utils.compatible');
var array = require('blear.utils.array');

var w = window;
var File = w[compatible.js('File', w)];


/**
 * 解析事件携带的 files
 * @param eve
 * @param items
 * @param filter
 * @returns {Array}
 */
var parseEventOfFiles = function (eve, items, filter) {
    var files = [];

    if (!typeis.Function(filter)) {
        filter = defaultFilter;
    }

    array.each(items, function (index, item) {
        if (!item) {
            return;
        }

        if (item.constructor === File) {
            if (item && filter(item)) {
                files.push(item);
            }
        }

        if (item.kind === 'file') {
            var file = item.getAsFile();

            if (file && filter(file)) {
                files.push(file);
            }
        }
    });

    return files;
};

/**
 * 解析事件内携带的文件
 * @param eve
 * @param ele
 * @returns {Array}
 */
module.exports = function (eve, ele) {
    eve = eve.originalEvent || eve;

    var filter = function (file) {
        return /^image\//.test(file.type);
    };

    if (eve.dataTransfer && eve.dataTransfer.items) {
        return parseEventOfFiles(eve, eve.dataTransfer && eve.dataTransfer.items, filter);
    } else if (eve.clipboardData && eve.clipboardData.items) {
        return parseEventOfFiles(eve, eve.clipboardData && eve.clipboardData.items, filter);
    } else if (ele.files) {
        return parseEventOfFiles(eve, ele.files, filter);
    } else if (ele.value) {
        return [null];
    }

    return [];
};


