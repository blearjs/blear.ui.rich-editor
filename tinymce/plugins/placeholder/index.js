/**
 * 文件描述
 * @author ydr.me
 * @create 2018-09-06 17:54
 * @update 2018-09-06 17:54
 */


'use strict';

tinymce.PluginManager.add('placeholder', function (editor) {
    editor.on('init', function () {

        var placeholder = editor.settings.placeholder;
        var dom = editor.dom;
        var className = 'mce-placeholder';
        var body = editor.getBody();

        editor.appendContentStyle(
            '.mce-placeholder::before{' +
            /****/'content:"' + placeholder + '";' +
            /****/'color:#999;' +
            /****/'z-index:-1;' +
            /****/'background:transparent;' +
            /****/'position:absolute;' +
            '}'
        );

        var display = null;
        var check = function () {
            var text = editor.getContent({
                format: 'text'
            }).trim();
            var _display = text === '';

            if (_display === display) {
                return;
            }

            display = _display;

            if (display) {
                dom.addClass(body, className);
            } else {
                dom.removeClass(body, className);
            }
        };

        editor.on('init nodechange setcontent keyup', check);

    });
});


