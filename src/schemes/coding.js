/**
 * coding 方案
 * 按钮：加粗、斜体、下划线、删除线、链接、去链接、前景色、背景色、无序列表、有序列表、图片、代码
 * 按钮：格式、左对齐、居中对齐、右对齐、横线、清除格式、撤销、重做、源码、全屏
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
require('../tinymce/plugins/textcolor/index');
require('../tinymce/plugins/lists/index');
require('../tinymce/plugins/fullscreen/index');
require('../tinymce/plugins/hr/index');
require('../tinymce/plugins/codesample/index');
require('../tinymce/plugins/code/index');

module.exports = {
    toolbar: [
        'bold italic underline strikethrough link unlink forecolor backcolor bullist numlist image codesample',
        'formatselect alignleft aligncenter alignright hr removeformat undo redo fullscreen code'
    ],
    contextMenu: 'bold italic underline strikethrough link'
};


