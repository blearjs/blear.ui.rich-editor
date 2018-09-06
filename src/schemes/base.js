/**
 * base 方案
 * 按钮：加粗、斜体、下划线、删除线
 * 右键：加粗、斜体、下划线、删除线
 * @author ydr.me
 * @create 2018-09-06 08:18
 * @update 2018-09-06 08:18
 */


'use strict';

require('../tinymce/plugins/contextmenu/index');

module.exports = {
    toolbar: [
        'bold italic underline strikethrough'
    ],
    contextMenu: 'bold italic underline strikethrough link'
};


