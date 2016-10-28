/**
 * Zwsp.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * ....
 *
 * @private
 * @class tinymce.text.Zwsp
 * @example
 * var isZwsp = Zwsp.isZwsp('\u200b');
 * var abc = Zwsp.trim('a\u200bc');
 */

var ZWSP = '\uFEFF';

function isZwsp(chr) {
    return chr == ZWSP;
}

function trim(str) {
    return str.replace(new RegExp(ZWSP, 'g'), '');
}

module.exports = {
    isZwsp: isZwsp,
    ZWSP: ZWSP,
    trim: trim
};