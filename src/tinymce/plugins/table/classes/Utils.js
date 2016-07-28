/**
 * Utils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Various utility functions.
 *
 * @class tinymce.tableplugin.Utils
 * @private
 */

    var Env = require("../../../classes/Env");

    function getSpanVal(td, name) {
        return parseInt(td.getAttribute(name) || 1, 10);
    }

    function paddCell(cell) {
        if (!Env.ie || Env.ie > 9) {
            cell.innerHTML = '<br data-mce-bogus="1" />';
        }
    }

    return {
        getSpanVal: getSpanVal,
        paddCell: paddCell
    };
});