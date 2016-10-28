/**
 * Compat.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * TinyMCE core class.
 *
 * @static
 * @class tinymce
 * @borrow-members tinymce.EditorManager
 * @borrow-members tinymce.util.Tools
 */

var DOMUtils = require('./dom/DOMUtils');
var EventUtils = require('./dom/EventUtils');
var ScriptLoader = require('./dom/ScriptLoader');
var AddOnManager = require('./AddOnManager');
var Tools = require('./util/Tools');
var Env = require('./Env');
var tinymce = window.tinymce;

/**
 * @property {tinymce.dom.DOMUtils} DOM Global DOM instance.
 * @property {tinymce.dom.ScriptLoader} ScriptLoader Global ScriptLoader instance.
 * @property {tinymce.AddOnManager} PluginManager Global PluginManager instance.
 * @property {tinymce.AddOnManager} ThemeManager Global ThemeManager instance.
 */
tinymce.DOM = DOMUtils.DOM;
tinymce.ScriptLoader = ScriptLoader.ScriptLoader;
tinymce.PluginManager = AddOnManager.PluginManager;
tinymce.ThemeManager = AddOnManager.ThemeManager;

tinymce.dom = tinymce.dom || {};
tinymce.dom.Event = EventUtils.Event;

Tools.each(Tools, function (func, key) {
    tinymce[key] = func;
});

Tools.each('isOpera isWebKit isIE isGecko isMac'.split(' '), function (name) {
    tinymce[name] = Env[name.substr(2).toLowerCase()];
});

return {};