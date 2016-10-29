var PluginManager = require("../../classes/AddOnManager").PluginManager;
var Arr = require('../../classes/util/Arr');
var Tools = require('../../classes/util/Tools');


/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

PluginManager.add('link', function (editor) {
    function createLinkList(callback) {
        return function () {
            callback();
        };
    }

    function buildListItems(inputList, itemCallback, startItems) {
        function appendItems(values, output) {
            output = output || [];

            Arr.each(values, function (item) {
                var menuItem = {text: item.text || item.title};

                if (item.menu) {
                    menuItem.menu = appendItems(item.menu);
                } else {
                    menuItem.value = item.value;

                    if (itemCallback) {
                        itemCallback(menuItem);
                    }
                }

                output.push(menuItem);
            });

            return output;
        }

        return appendItems(inputList, startItems || []);
    }

    function showDialog() {
        var data = {}, selection = editor.selection, dom = editor.dom, selectedElm, anchorElm, initialText;
        var win, onlyText, textListCtrl, linkListCtrl, value;

        function linkListChangeHandler(e) {
            var textCtrl = win.find('#text');

            if (!textCtrl.value() || (e.lastControl && textCtrl.value() == e.lastControl.text())) {
                textCtrl.value(e.control.text());
            }

            win.find('#href').value(e.control.value());
        }

        function buildAnchorListControl(url) {
            var anchorList = [];

            Arr.each(editor.dom.select('a:not([href])'), function (anchor) {
                var id = anchor.name || anchor.id;

                if (id) {
                    anchorList.push({
                        text: id,
                        value: '#' + id,
                        selected: url.indexOf('#' + id) != -1
                    });
                }
            });

            if (anchorList.length) {
                anchorList.unshift({text: 'None', value: ''});

                return {
                    name: 'anchor',
                    type: 'listbox',
                    label: 'Anchors',
                    values: anchorList,
                    onselect: linkListChangeHandler
                };
            }
        }

        function updateText() {
            if (!initialText && data.text.length === 0 && onlyText) {
                this.parent().parent().find('#text')[0].value(this.value());
            }
        }

        function urlChange(e) {
            var meta = e.meta || {};

            if (linkListCtrl) {
                linkListCtrl.value(editor.convertURL(this.value(), 'href'));
            }

            Arr.each(e.meta, function (value, key) {
                win.find('#' + key).value(value);
            });

            if (!meta.text) {
                updateText.call(this);
            }
        }

        function isOnlyTextSelected(anchorElm) {
            var html = selection.getContent();

            // Partial html and not a fully selected anchor element
            if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') == -1)) {
                return false;
            }

            if (anchorElm) {
                var nodes = anchorElm.childNodes, i;

                if (nodes.length === 0) {
                    return false;
                }

                for (i = nodes.length - 1; i >= 0; i--) {
                    if (nodes[i].nodeType != 3) {
                        return false;
                    }
                }
            }

            return true;
        }

        selectedElm = selection.getNode();
        anchorElm = dom.getParent(selectedElm, 'a[href]');
        onlyText = isOnlyTextSelected();

        data.text = initialText = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : selection.getContent({format: 'text'});
        data.href = anchorElm ? dom.getAttrib(anchorElm, 'href') : '';

        if (anchorElm) {
            data.target = dom.getAttrib(anchorElm, 'target');
        } else if (editor.settings.default_link_target) {
            data.target = editor.settings.default_link_target;
        }

        if ((value = dom.getAttrib(anchorElm, 'rel'))) {
            data.rel = value;
        }

        if ((value = dom.getAttrib(anchorElm, 'class'))) {
            data['class'] = value;
        }

        if ((value = dom.getAttrib(anchorElm, 'title'))) {
            data.title = value;
        }

        if (onlyText) {
            textListCtrl = {
                name: 'text',
                type: 'textbox',
                size: 40,
                label: 'Text to display',
                onchange: function () {
                    data.text = this.value();
                }
            };
        }

        win = editor.windowManager.open({
            title: 'Insert link',
            data: data,
            body: [
                {
                    name: 'href',
                    type: 'textbox',
                    filetype: 'file',
                    size: 40,
                    autofocus: true,
                    label: 'Url',
                    onchange: urlChange,
                    onkeyup: updateText
                },
                textListCtrl,
                buildAnchorListControl(data.href)
            ],
            onSubmit: function (e) {
                /*eslint dot-notation: 0*/
                var href;

                data = Tools.extend(data, e.data);
                href = data.href;

                function insertLink() {
                    var linkAttrs = {
                        href: href,
                        target: data.target ? data.target : null,
                        rel: data.rel ? data.rel : null,
                        "class": data["class"] ? data["class"] : null,
                        title: data.title ? data.title : null
                    };

                    if (anchorElm) {
                        editor.focus();

                        if (onlyText && data.text != initialText) {
                            if ("innerText" in anchorElm) {
                                anchorElm.innerText = data.text;
                            } else {
                                anchorElm.textContent = data.text;
                            }
                        }

                        dom.setAttribs(anchorElm, linkAttrs);

                        selection.select(anchorElm);
                        editor.undoManager.add();
                    } else {
                        if (onlyText) {
                            editor.insertContent(dom.createHTML('a', linkAttrs, dom.encode(data.text)));
                        } else {
                            editor.execCommand('mceInsertLink', false, linkAttrs);
                        }
                    }
                }

                if (!href) {
                    editor.execCommand('unlink');
                    return;
                }

                // Is email and not //user@domain.com
                //if (href.indexOf('@') > 0 && href.indexOf('//') == -1 && href.indexOf('mailto:') == -1) {
                //    delayedConfirm(
                //        'The URL you entered seems to be an email address. Do you want to add the required mailto: prefix?',
                //        function (state) {
                //            if (state) {
                //                href = 'mailto:' + href;
                //            }
                //
                //            insertLink();
                //        }
                //    );
                //
                //    return;
                //}
                //
                //// Is not protocol prefixed
                //if ((editor.settings.link_assume_external_targets && !/^\w+:/i.test(href)) ||
                //    (!editor.settings.link_assume_external_targets && /^\s*www[\.|\d\.]/i.test(href))) {
                //    delayedConfirm(
                //        'The URL you entered seems to be an external link. Do you want to add the required http:// prefix?',
                //        function (state) {
                //            if (state) {
                //                href = 'http://' + href;
                //            }
                //
                //            insertLink();
                //        }
                //    );
                //
                //    return;
                //}

                insertLink();
            }
        });
    }

    editor.addButton('link', {
        icon: 'link',
        tooltip: 'Insert/edit link',
        shortcut: 'Meta+K',
        onclick: createLinkList(showDialog),
        stateSelector: 'a[href]'
    });

    editor.addButton('unlink', {
        icon: 'unlink',
        tooltip: 'Remove link',
        cmd: 'unlink',
        stateSelector: 'a[href]'
    });

    editor.addShortcut('Meta+K', '', createLinkList(showDialog));
    editor.addCommand('mceLink', createLinkList(showDialog));

    this.showDialog = showDialog;

    editor.addMenuItem('link', {
        icon: 'link',
        text: 'Insert/edit link',
        shortcut: 'Meta+K',
        onclick: createLinkList(showDialog),
        stateSelector: 'a[href]',
        context: 'insert',
        prependToContext: true
    });
});
