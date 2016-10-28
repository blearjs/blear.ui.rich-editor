/**
 * LinkTargets.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This module is enables you to get anything that you can link to in a element.
 *
 * @private
 * @class tinymce.content.LinkTargets
 */


var DOMUtils = require('../dom/DOMUtils');
var Fun = require('../util/Fun');
var Arr = require('../util/Arr');
var Uuid = require('../util/Uuid');
var Tools = require('../util/Tools');
var trim = Tools.trim;

var create = function (type, title, url, level, attach) {
    return {
        type: type,
        title: title,
        url: url,
        level: level,
        attach: attach
    };
};

var select = function (selector, root) {
    return DOMUtils.DOM.select(selector, root);
};

var getElementText = function (elm) {
    return elm.innerText || elm.textContent;
};

var getOrGenerateId = function (elm) {
    return elm.id ? elm.id : Uuid.uuid('h');
};

var isAnchor = function (elm) {
    return elm && elm.nodeName === 'A' && (elm.id || elm.name);
};

var isHeader = function (elm) {
    return elm && /^(H[1-6])$/.test(elm.nodeName);
};

var getLevel = function (elm) {
    return isHeader(elm) ? parseInt(elm.nodeName.substr(1), 10) : 0;
};

var headerTarget = function (elm) {
    var headerId = getOrGenerateId(elm);

    var attach = function () {
        elm.id = headerId;
    };

    return create('header', getElementText(elm), '#' + headerId, getLevel(elm), attach);
};

var anchorTarget = function (elm) {
    var anchorId = elm.id || elm.name;
    var anchorText = getElementText(elm);

    return create('anchor', anchorText ? anchorText : '#' + anchorId, '#' + anchorId, 0, Fun.noop);
};

var getHeaderTargets = function (elms) {
    return Arr.map(Arr.filter(elms, isHeader), headerTarget);
};

var getAnchorTargets = function (elms) {
    return Arr.map(Arr.filter(elms, isAnchor), anchorTarget);
};

var getTargetElements = function (elm) {
    var elms = select('h1,h2,h3,h4,h5,h6,a:not([href])', elm);
    return elms;
};

var hasTitle = function (target) {
    return trim(target.title).length > 0;
};

var find = function (elm) {
    var elms = getTargetElements(elm);
    return Arr.filter(getHeaderTargets(elms).concat(getAnchorTargets(elms)), hasTitle);
};

module.exports = {
    find: find
};