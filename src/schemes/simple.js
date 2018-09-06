/**
 * writing 方案
 * 按钮：加粗、斜体、下划线、删除线、链接、去链接、无序列表、有序列表、图片
 * 按钮：格式、前景色、背景色
 * 右键：加粗、斜体、下划线、删除线、链接
 * @author ydr.me
 * @create 2018-09-06 08:18
 * @update 2018-09-06 08:18
 */


'use strict';

require('../tinymce/plugins/advlist/index');
require('../tinymce/plugins/link/index');
require('../tinymce/plugins/image/index');
require('../tinymce/plugins/contextmenu/index');

module.exports = {
    toolbar: [
        'bold italic underline strikethrough link unlink bullist numlist image'
    ],
    contextMenu: 'bold italic underline strikethrough link'
};


