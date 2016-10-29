/**
 * FilePicker.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

/**
 * This class creates a file picker control.
 *
 * @class tinymce.ui.FilePicker
 * @extends tinymce.ui.ComboBox
 */

"use strict";

var selector = require('blear.core.selector');

var ComboBox = require("./ComboBox");
var Tools = require("../util/Tools");
var Arr = require("../util/Arr");
var Fun = require("../util/Fun");
var VK = require("../util/VK");
var LinkTargets = require('../content/LinkTargets');

var history = {};
var HISTORY_LENGTH = 5;

var toMenuItem = function (target) {
    return {
        title: target.title,
        value: {
            title: {raw: target.title},
            url: target.url,
            attach: target.attach
        }
    };
};

var toMenuItems = function (targets) {
    return Tools.map(targets, toMenuItem);
};

var staticMenuItem = function (title, url) {
    return {
        title: title,
        value: {
            title: title,
            url: url,
            attach: Fun.noop
        }
    };
};

var isUniqueUrl = function (url, targets) {
    var foundTarget = Arr.find(targets, function (target) {
        return target.url === url;
    });

    return !foundTarget;
};

var getSetting = function (editorSettings, name, defaultValue) {
    var value = name in editorSettings ? editorSettings[name] : defaultValue;
    return value === false ? null : value;
};

var createMenuItems = function (term, targets, fileType, editorSettings) {
    var separator = {title: '-'};

    var fromHistoryMenuItems = function (history) {
        var uniqueHistory = Arr.filter(history[fileType], function (url) {
            return isUniqueUrl(url, targets);
        });

        return Tools.map(uniqueHistory, function (url) {
            return {
                title: url,
                value: {
                    title: url,
                    url: url,
                    attach: Fun.noop
                }
            };
        });
    };

    var fromMenuItems = function (type) {
        var filteredTargets = Arr.filter(targets, function (target) {
            return target.type == type;
        });

        return toMenuItems(filteredTargets);
    };

    var join = function (items) {
        return Arr.reduce(items, function (a, b) {
            var bothEmpty = a.length === 0 || b.length === 0;
            return bothEmpty ? a.concat(b) : a.concat(separator, b);
        }, []);
    };

    if (editorSettings.typeahead_urls === false) {
        return [];
    }

    return join([
        filterByQuery(term, fromHistoryMenuItems(history)),
        filterByQuery(term, fromMenuItems('header'))
    ]);
};

var addToHistory = function (url, fileType) {
    var items = history[fileType];

    if (!/^https?/.test(url)) {
        return;
    }

    if (items) {
        if (Arr.indexOf(items, url) === -1) {
            history[fileType] = items.slice(0, HISTORY_LENGTH).concat(url);
        }
    } else {
        history[fileType] = [url];
    }
};

var filterByQuery = function (term, menuItems) {
    var lowerCaseTerm = term.toLowerCase();
    var result = Tools.grep(menuItems, function (item) {
        return item.title.toLowerCase().indexOf(lowerCaseTerm) !== -1;
    });

    return result.length === 1 && result[0].title === term ? [] : result;
};

var getTitle = function (linkDetails) {
    var title = linkDetails.title;
    return title.raw ? title.raw : title;
};

var setupAutoCompleteHandler = function (ctrl, editorSettings, bodyElm, fileType) {
    var autocomplete = function (term) {
        var linkTargets = LinkTargets.find(bodyElm);
        var menuItems = createMenuItems(term, linkTargets, fileType, editorSettings);
        ctrl.showAutoComplete(menuItems, term);
    };

    ctrl.on('autocomplete', function () {
        autocomplete(ctrl.value());
    });

    ctrl.on('selectitem', function (e) {
        var linkDetails = e.value;

        ctrl.value(linkDetails.url);
        var title = getTitle(linkDetails);

        if (fileType === 'image') {
            ctrl.fire('change', {meta: {alt: title, attach: linkDetails.attach}});
        } else {
            ctrl.fire('change', {meta: {text: title, attach: linkDetails.attach}});
        }

        ctrl.focus();
    });

    ctrl.on('click', function () {
        if (ctrl.value().length === 0) {
            autocomplete('');
        }
    });

    ctrl.on('PostRender', function () {
        ctrl.getRoot().on('submit', function (e) {
            if (!e.isDefaultPrevented()) {
                addToHistory(ctrl.value(), fileType);
            }
        });
    });
};

var statusToUiState = function (result) {
    var status = result.status, message = result.message;

    if (status === 'valid') {
        return {status: 'ok', message: message};
    } else if (status === 'unknown') {
        return {status: 'warn', message: message};
    } else if (status === 'invalid') {
        return {status: 'warn', message: message};
    } else {
        return {status: 'none', message: ''};
    }
};

var setupLinkValidatorHandler = function (ctrl, editorSettings, fileType) {
    var validatorHandler = editorSettings.filepicker_validator_handler;
    if (validatorHandler) {
        var validateUrl = function (url) {
            if (url.length === 0) {
                ctrl.statusLevel('none');
                return;
            }

            validatorHandler({
                url: url,
                type: fileType
            }, function (result) {
                var uiState = statusToUiState(result);

                ctrl.statusMessage(uiState.message);
                ctrl.statusLevel(uiState.status);
            });
        };

        ctrl.state.on('change:value', function (e) {
            validateUrl(e.value);
        });
    }
};

module.exports = ComboBox.extend({
    /**
     * Constructs a new control instance with the specified settings.
     *
     * @constructor
     * @param {Object} settings Name/value object with settings.
     */
    init: function (settings) {
        var self = this, editor = window.tinymce.activeEditor, editorSettings = editor.settings;
        var fileType = settings.filetype;

        settings.spellcheck = false;
        settings.icon = 'browse';
        settings.onaction = function () {
            var meta = self.fire('beforecall').meta;

            meta = Tools.extend({filetype: settings.filetype}, meta);
            editorSettings.file_picker_callback.call(
                editor,
                function (value, meta) {
                    var root = self;

                    while (root._parent) {
                        root = root._parent;
                    }

                    root.settings.onUpload(meta);
                },
                self.getEl('inp'),
                meta
            );
        };
        self._super(settings);
        setupAutoCompleteHandler(self, editorSettings, editor.getBody(), fileType);
        setupLinkValidatorHandler(self, editorSettings, fileType);
    }
});