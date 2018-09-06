(function () {
    var codesample = (function () {
        'use strict';

        var Cell = function (initial) {
            var value = initial;
            var get = function () {
                return value;
            };
            var set = function (v) {
                value = v;
            };
            var clone = function () {
                return Cell(get());
            };
            return {
                get: get,
                set: set,
                clone: clone
            };
        };

        var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

        var global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

        var getContentCss = function (editor) {
            return editor.settings.codesample_content_css;
        };
        var getLanguages = function (editor) {
            return editor.settings.codesample_languages;
        };
        var getDialogMinWidth = function (editor) {
            return Math.min(global$1.DOM.getViewPort().w, editor.getParam('codesample_dialog_width', 800));
        };
        var getDialogMinHeight = function (editor) {
            return Math.min(global$1.DOM.getViewPort().w, editor.getParam('codesample_dialog_height', 650));
        };
        var $_fwpmvkabjkmcwo95 = {
            getContentCss: getContentCss,
            getLanguages: getLanguages,
            getDialogMinWidth: getDialogMinWidth,
            getDialogMinHeight: getDialogMinHeight
        };

        function isCodeSample(elm) {
            return elm && elm.nodeName === 'PRE' && elm.className.indexOf('language-') !== -1;
        }

        function trimArg(predicateFn) {
            return function (arg1, arg2) {
                return predicateFn(arg2);
            };
        }

        var $_45zyxsagjkmcwoas = {
            isCodeSample: isCodeSample,
            trimArg: trimArg
        };

        var getSelectedCodeSample = function (editor) {
            var node = editor.selection.getNode();
            if ($_45zyxsagjkmcwoas.isCodeSample(node)) {
                return node;
            }
            return null;
        };
        var insertCodeSample = function (editor, language, code) {
            editor.undoManager.transact(function () {
                var node = getSelectedCodeSample(editor);
                code = global$1.DOM.encode(code);
                if (node) {
                    editor.dom.setAttrib(node, 'class', 'language-' + language);
                    node.innerHTML = code;
                    window.Prism.highlightElement(node);
                    editor.selection.select(node);
                } else {
                    editor.insertContent('<pre id="__new" class="prism language-' + language + '">' + code + '</pre>');
                    editor.selection.select(editor.$('#__new').removeAttr('id')[0]);
                }
            });
        };
        var getCurrentCode = function (editor) {
            var node = getSelectedCodeSample(editor);
            if (node) {
                return node.textContent;
            }
            return '';
        };
        var $_7llv6ladjkmcwo9b = {
            getSelectedCodeSample: getSelectedCodeSample,
            insertCodeSample: insertCodeSample,
            getCurrentCode: getCurrentCode
        };

        var getLanguages$1 = function (editor) {
            var defaultLanguages = [
                {
                    text: 'HTML/XML',
                    value: 'markup'
                },
                {
                    text: 'JavaScript',
                    value: 'javascript'
                },
                {
                    text: 'CSS',
                    value: 'css'
                },
                {
                    text: 'C',
                    value: 'c'
                }
            ];
            var customLanguages = $_fwpmvkabjkmcwo95.getLanguages(editor);
            return customLanguages ? customLanguages : defaultLanguages;
        };
        var getCurrentLanguage = function (editor) {
            var matches;
            var node = $_7llv6ladjkmcwo9b.getSelectedCodeSample(editor);
            if (node) {
                matches = node.className.match(/language-(\w+)/);
                return matches ? matches[1] : '';
            }
            return '';
        };
        var $_ehme9lahjkmcwoat = {
            getLanguages: getLanguages$1,
            getCurrentLanguage: getCurrentLanguage
        };

        var $_7apbbvaajkmcwo93 = {
            open: function (editor) {
                var minWidth = $_fwpmvkabjkmcwo95.getDialogMinWidth(editor);
                var minHeight = $_fwpmvkabjkmcwo95.getDialogMinHeight(editor);
                var currentLanguage = $_ehme9lahjkmcwoat.getCurrentLanguage(editor);
                var currentLanguages = $_ehme9lahjkmcwoat.getLanguages(editor);
                var currentCode = $_7llv6ladjkmcwo9b.getCurrentCode(editor);
                editor.windowManager.open({
                    title: 'Insert/Edit code sample',
                    minWidth: minWidth,
                    minHeight: minHeight,
                    layout: 'flex',
                    direction: 'column',
                    align: 'stretch',
                    body: [
                        {
                            type: 'listbox',
                            name: 'language',
                            label: 'Language',
                            maxWidth: 200,
                            value: currentLanguage,
                            values: currentLanguages
                        },
                        {
                            type: 'textbox',
                            name: 'code',
                            multiline: true,
                            spellcheck: false,
                            ariaLabel: 'Code view',
                            flex: 1,
                            style: 'direction: ltr; text-align: left',
                            classes: 'monospace',
                            value: currentCode,
                            autofocus: true
                        }
                    ],
                    onSubmit: function (e) {
                        $_7llv6ladjkmcwo9b.insertCodeSample(editor, e.data.language, e.data.code);
                    }
                });
            }
        };

        var register = function (editor) {
            editor.addCommand('codesample', function () {
                var node = editor.selection.getNode();
                if (editor.selection.isCollapsed() || $_45zyxsagjkmcwoas.isCodeSample(node)) {
                    $_7apbbvaajkmcwo93.open(editor);
                } else {
                    editor.formatter.toggle('code');
                }
            });
        };
        var $_3nzffua9jkmcwo92 = {register: register};

        var setup = function (editor) {
            var $ = editor.$;
            editor.on('PreProcess', function (e) {
                $('pre[contenteditable=false]', e.node).filter($_45zyxsagjkmcwoas.trimArg($_45zyxsagjkmcwoas.isCodeSample)).each(function (idx, elm) {
                    var $elm = $(elm), code = elm.textContent;
                    $elm.attr('class', $.trim($elm.attr('class')));
                    $elm.removeAttr('contentEditable');
                    $elm.empty().append($('<code></code>').each(function () {
                        this.textContent = code;
                    }));
                });
            });
            editor.on('SetContent', function () {
                var unprocessedCodeSamples = $('pre').filter($_45zyxsagjkmcwoas.trimArg($_45zyxsagjkmcwoas.isCodeSample)).filter(function (idx, elm) {
                    return elm.contentEditable !== 'false';
                });
                if (unprocessedCodeSamples.length) {
                    editor.undoManager.transact(function () {
                        unprocessedCodeSamples.each(function (idx, elm) {
                            $(elm).find('br').each(function (idx, elm) {
                                elm.parentNode.replaceChild(editor.getDoc().createTextNode('\n'), elm);
                            });
                            elm.contentEditable = false;
                            elm.innerHTML = editor.dom.encode(elm.textContent);
                            window.Prism.highlightElement(elm);
                            elm.className = $.trim(elm.className);
                        });
                    });
                }
            });
        };
        var $_cywqvhaijkmcwoav = {setup: setup};

        var loadCss = function (editor, pluginUrl, addedInlineCss, addedCss) {
            if (editor.inline && addedInlineCss.get()) {
                return;
            }

            if (!editor.inline && addedCss.get()) {
                return;
            }

            if (editor.inline) {
                addedInlineCss.set(true);
            } else {
                addedCss.set(true);
            }
        };
        var $_8uv0xyajjkmcwoax = {loadCss: loadCss};

        var register$1 = function (editor) {
            editor.addButton('codesample', {
                cmd: 'codesample',
                title: 'Insert/Edit code sample'
            });
            editor.addMenuItem('codesample', {
                cmd: 'codesample',
                text: 'Code sample',
                icon: 'codesample'
            });
        };
        var $_91sx9bakjkmcwoaz = {register: register$1};

        var addedInlineCss = Cell(false);
        global.add('codesample', function (editor, pluginUrl) {
            var addedCss = Cell(false);
            $_cywqvhaijkmcwoav.setup(editor);
            $_91sx9bakjkmcwoaz.register(editor);
            $_3nzffua9jkmcwo92.register(editor);
            editor.on('init', function () {
                $_8uv0xyajjkmcwoax.loadCss(editor, pluginUrl, addedInlineCss, addedCss);
            });
            editor.on('dblclick', function (ev) {
                if ($_45zyxsagjkmcwoas.isCodeSample(ev.target)) {
                    $_7apbbvaajkmcwo93.open(editor);
                }
            });
        });

        function Plugin() {
        }

        return Plugin;

    }());
})();
