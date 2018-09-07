/**
 * 占位字符插件
 * @author ydr.me
 * @create 2018-09-06 17:54
 * @update 2018-09-06 17:54
 */


'use strict';

var selector = require('blear.core.selector');

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
        var isEmpty = function () {
            var bodyEl = editor.getBody();
            var els = selector.children(bodyEl);

            // 如果有多个段落
            if (els.length > 1) {
                return false;
            }

            var pEl = els[0];

            if (!pEl) {
                return true;
            }

            var text = pEl.innerText.trim();

            // 如果有文本内容
            if (text) {
                return false;
            }

            // 再判断当前段落有没有非 BR
            els = selector.children(pEl);
            els = selector.filter(els, function (el) {
                return el.tagName.toLowerCase() !== 'br';
            });

            return els.length === 0;
        };
        var check = function () {
            var _display = isEmpty();

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


