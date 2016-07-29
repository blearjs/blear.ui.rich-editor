/**
 * 自动固定顶部工具栏
 * @author ydr.me
 * @create 2016-02-15 10:08
 */



'use strict';

var fun = require('blear.utils.function');
var attribute = require('blear.core.attribute');
var layout = require('blear.core.layout');
var event = require('blear.core.event');

var win = window;
var doc = win.document;
var PluginManager = require("../../classes/AddOnManager").PluginManager;

PluginManager.add('auto-fixed-toolbar', function (editor) {
    var resize = function (eve) {
        if (editor.destroyed) {
            return;
        }

        var toolbarEle = editor.theme.getToolbar();

        if (!toolbarEle) {
            return;
        }

        var containerEle = editor.getContainer();

        if (!containerEle) {
            return;
        }

        var scrollTop = layout.scrollTop(win);
        var containerTop = layout.offsetTop(containerEle);
        var winScrollLeft = layout.scrollLeft(win);
        var toolbarHeight = layout.height(toolbarEle);
        var containerHeight = layout.height(containerEle);
        var containerLeft = layout.offsetLeft(containerEle);

        if (scrollTop > containerTop && scrollTop < containerTop + containerHeight - toolbarHeight) {
            attribute.style(toolbarEle, {
                position: 'fixed',
                width: layout.innerWidth(containerEle),
                top: 0,
                zIndex: 9,
                left: containerLeft - winScrollLeft
            });
            attribute.style(containerEle, 'padding-top', layout.outerHeight(toolbarEle));
        } else {
            attribute.style(toolbarEle, {
                position: 'static',
                width: 'auto',
                top: 'auto',
                zIndex: 'auto',
                left: 'auto'
            });
            attribute.style(containerEle, 'padding-top', 0);
        }
    };

    event.on(win, 'scroll resize', fun.debounce(resize, 10));
    event.on(doc, 'scroll', fun.debounce(resize, 10));

    // Add appropriate listeners for resizing content area
    editor.on("nodechange setcontent keyup FullscreenStateChanged", fun.debounce(resize, 10));

    if (editor.getParam('auto_fixed_toolbar_on_init', true)) {
        editor.on('init', fun.once(resize));
    }

    // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
    editor.addCommand('mceAutoResize', resize);
});
