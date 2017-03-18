/**
 * 粘贴、拖拽图片上传
 * @author ydr.me
 * @create 2016-02-02 11:47
 */



'use strict';

var typeis = require('blear.utils.typeis');
var time = require('blear.utils.time');
var loader = require('blear.utils.loader');
var modification = require('blear.core.modification');

var parseEventFiles = require('../../../parse-event-files');
var PluginManager = require("../../classes/AddOnManager").PluginManager;

PluginManager.add('paste-drop-upload-image', function (editor) {
    var settings = editor.settings;
    var fileEl = modification.create('input', {
        type: 'file',
        name: settings.uploadFileName,
        style: {
            display: 'none'
        }
    });
    var resolve = function (img) {
        if (typeis.String(img)) {
            img = {
                src: img
            };
        }

        img.src = img.src || img.url;

        loader.img(img.src, function (err) {
            if (err) {
                return;
            }

            img.width = this.width;
            img.height = this.height;
            editor.undoManager.transact(function () {
                img.id = '__mcenew';
                editor.selection.setContent(editor.dom.createHTML('img', img));
                var imgElm = editor.dom.get(img.id);
                editor.dom.setAttrib(imgElm, 'id', null);
                editor.selection.select(imgElm);
                editor.nodeChanged();
                time.nextFrame(function () {
                    editor.focus();
                });
            });
        });
    };

    editor.on('dragenter dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    editor.on('paste drop', function (eve) {
        var imgs = parseEventFiles(eve, this.getDoc());

        if (!imgs.length) {
            return;
        }

        editor.fire('upload', [fileEl, imgs, resolve]);
    });
});
