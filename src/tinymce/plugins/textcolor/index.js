var tinymce = window.tinymce;
var PluginManager = require("../../classes/AddOnManager").PluginManager;

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
/*eslint consistent-this:0 */

PluginManager.add('textcolor', function (editor) {
    var cols, rows;

    rows = editor.settings.textcolor_rows || 5;
    cols = editor.settings.textcolor_cols || 9;

    function getCurrentColor(format) {
        var color;

        editor.dom.getParents(editor.selection.getStart(), function (elm) {
            var value;

            if ((value = elm.style[format == 'forecolor' ? 'color' : 'background-color'])) {
                color = value;
            }
        });

        return color;
    }

    function mapColors() {
        var i, colors = [], colorMap;

        colorMap = editor.settings.textcolor_map || [
                "ffffff", "ffd7d5", "ffdaa9", "fffed5", "d4fa00", "73fcd6", "a5c8ff", "ffacd5", "ff7faa",
                "d6d6d6", "ffacaa", "ffb995", "fffb00", "73fa79", "00fcff", "78acf1", "d84fa9", "ff4f79",
                "b2b2b2", "d7aba9", "ff6827", "ffda51", "00d100", "00d5ff", "0080ff", "ac39ff", "ff2941",
                "888888", "7a4442", "ff4c00", "ffa900", "3da742", "3dad66", "0052ff", "7a4fd6", "d92142",
                "000000", "7b0c00", "ff4c41", 'd6a841', '407600', '007aaa', '021eaa', '797baa', 'ab1942'
                /*transparent*/
            ];

        for (i = 0; i < colorMap.length; i++) {
            colors.push('#' + colorMap[i]);
        }

        return colors;
    }

    function renderColorPicker() {
        var ctrl = this, colors, color, html, last, x, y, i, id = ctrl._id, count = 0;

        function getColorCellHtml(color) {
            var isNoColor = color == 'transparent';

            return (
                '<td class="mce-grid-cell' + (isNoColor ? ' mce-colorbtn-trans' : '') + '">' +
                '<div id="' + id + '-' + (count++) + '"' +
                ' data-mce-color="' + (color ? color : '') + '"' +
                ' role="option"' +
                ' tabIndex="-1"' +
                ' style="' + (color ? 'background-color: ' + color : '') + '">' +
                (isNoColor ? '&#215;' : '') +
                '</div>' +
                '</td>'
            );
        }

        colors = mapColors();
        // colors.push('transparent');

        html = '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody>';
        last = colors.length - 1;

        for (y = 0; y < rows; y++) {
            html += '<tr>';

            for (x = 0; x < cols; x++) {
                i = y * cols + x;

                if (i > last) {
                    html += '<td></td>';
                } else {
                    color = colors[i];
                    html += getColorCellHtml(color);
                }
            }

            html += '</tr>';
        }

        if (editor.settings.color_picker_callback) {
            html += (
                '<tr>' +
                '<td colspan="' + cols + '" class="mce-custom-color-btn">' +
                '<div id="' + id + '-c" class="mce-widget mce-btn mce-btn-small mce-btn-flat" ' +
                'role="button" tabindex="-1" aria-labelledby="' + id + '-c" style="width: 100%">' +
                '<button type="button" role="presentation" tabindex="-1">' + tinymce.translate('Custom...') + '</button>' +
                '</div>' +
                '</td>' +
                '</tr>'
            );

            html += '<tr>';

            for (x = 0; x < cols; x++) {
                html += getColorCellHtml('', 'Custom color');
            }

            html += '</tr>';
        }

        html += '</tbody></table>';

        return html;
    }

    function applyFormat(format, value) {
        editor.undoManager.transact(function () {
            editor.focus();
            editor.formatter.apply(format, {value: value});
            editor.nodeChanged();
        });
    }

    function removeFormat(format) {
        editor.undoManager.transact(function () {
            editor.focus();
            editor.formatter.remove(format, {value: null}, null, true);
            editor.nodeChanged();
        });
    }

    function onPanelClick(e) {
        var buttonCtrl = this.parent(), value;

        function selectColor(value) {
            buttonCtrl.hidePanel();
            buttonCtrl.color(value);
            applyFormat(buttonCtrl.settings.format, value);
        }

        function resetColor() {
            buttonCtrl.hidePanel();
            buttonCtrl.resetColor();
            removeFormat(buttonCtrl.settings.format);
        }

        function setDivColor(div, value) {
            div.style.background = value;
            div.setAttribute('data-mce-color', value);
        }

        if (tinymce.DOM.getParent(e.target, '.mce-custom-color-btn')) {
            buttonCtrl.hidePanel();

            editor.settings.color_picker_callback.call(editor, function (value) {
                var tableElm = buttonCtrl.panel.getEl().getElementsByTagName('table')[0];
                var customColorCells, div, i;

                customColorCells = tinymce.map(tableElm.rows[tableElm.rows.length - 1].childNodes, function (elm) {
                    return elm.firstChild;
                });

                for (i = 0; i < customColorCells.length; i++) {
                    div = customColorCells[i];
                    if (!div.getAttribute('data-mce-color')) {
                        break;
                    }
                }

                // Shift colors to the right
                // TODO: Might need to be the left on RTL
                if (i == cols) {
                    for (i = 0; i < cols - 1; i++) {
                        setDivColor(customColorCells[i], customColorCells[i + 1].getAttribute('data-mce-color'));
                    }
                }

                setDivColor(div, value);
                selectColor(value);
            }, getCurrentColor(buttonCtrl.settings.format));
        }

        value = e.target.getAttribute('data-mce-color');
        if (value) {
            if (this.lastId) {
                document.getElementById(this.lastId).setAttribute('aria-selected', false);
            }

            e.target.setAttribute('aria-selected', true);
            this.lastId = e.target.id;

            if (value == 'transparent') {
                resetColor();
            } else {
                selectColor(value);
            }
        } else if (value !== null) {
            buttonCtrl.hidePanel();
        }
    }

    function onButtonClick() {
        var self = this;

        if (self._color) {
            applyFormat(self.settings.format, self._color);
        } else {
            removeFormat(self.settings.format);
        }
    }

    editor.addButton('forecolor', {
        type: 'colorbutton',
        tooltip: 'Text color',
        format: 'forecolor',
        panel: {
            role: 'application',
            ariaRemember: true,
            html: renderColorPicker,
            onclick: onPanelClick
        },
        onclick: onButtonClick
    });

    editor.addButton('backcolor', {
        type: 'colorbutton',
        tooltip: 'Background color',
        format: 'hilitecolor',
        panel: {
            role: 'application',
            ariaRemember: true,
            html: renderColorPicker,
            onclick: onPanelClick
        },
        onclick: onButtonClick
    });
});
