"use strict";
var common_1 = require('../common');
function message_fragment(it) {
    return "\n<div v-show=\"" + it.pager + ".msg &amp;&amp; " + it.pager + ".state &amp; " + 7 /* MASK_STATUS */ + "\">\n  <div class=\"ui message\"\n      v-class=\"success:" + it.pager + ".state &amp; " + 1 /* SUCCESS */ + ",\n               error:" + it.pager + ".state &amp; " + 2 /* ERROR */ + ",\n               warning:" + it.pager + ".state &amp; " + 4 /* WARNING */ + "\">\n    <i class=\"close icon\" v-xon=\"click:" + it.pager + ".msg = null\"></i>\n    <span v-text=\"" + it.pager + ".msg\"></span>\n  </div>\n</div>";
}
exports.message_fragment = message_fragment;
function nav_item(it, content) {
    var track_clicks = common_1.when(it.track_clicks, ", (" + it.pager + ".$clicks ^= 1)");
    return "\n<div class=\"item\">\n  <div class=\"ui tiny icon buttons\">\n    " + common_1.when(it.content_loc === 4, content) + "\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"" + it.pager + ".state &amp; " + 8 /* LOADING */ + " || " + it.pager + ".page === 0\"\n        v-xon=\"click:" + it.pager + ".$handle(1, (" + it.pager + ".page = 0)" + track_clicks + ")\">\n        <i class=\"double angle left icon\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\" \n        v-disable=\"" + it.pager + ".state &amp; " + 8 /* LOADING */ + " || " + it.pager + ".page === 0\"\n        v-xon=\"click:" + it.pager + ".$handle(1, --" + it.pager + ".page" + track_clicks + ")\">\n        <i class=\"angle left icon\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"" + it.pager + ".state &amp; " + 8 /* LOADING */ + " || " + it.pager + ".page === " + it.pager + ".page_count\"\n        v-xon=\"click:" + it.pager + ".$handle(1, ++" + it.pager + ".page" + track_clicks + ")\">\n        <i class=\"angle right icon\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"" + it.pager + ".state &amp; " + 8 /* LOADING */ + " || " + it.pager + ".page === " + it.pager + ".page_count\"\n        v-xon=\"click:" + it.pager + ".$handle(1, (" + it.pager + ".page = " + it.pager + ".page_count)" + track_clicks + ")\">\n        <i class=\"double angle right icon\"></i>\n    </button>\n    " + common_1.when(it.content_loc === 5, content) + "\n  </div>\n</div>";
}
exports.nav_item = nav_item;
function count_item(it, content) {
    return "\n<div class=\"item\">\n  " + common_1.when(it.content_loc === 7, content) + "\n  <span v-show=\"" + it.pager + ".size !== 0\" v-text=\"" + it.pager + ".page_from\"></span>\n  <span v-show=\"" + it.pager + ".page_from !== " + it.pager + ".page_to\">\n  <span v-show=\"" + it.pager + ".size !== 0\" >-</span>\n  <span v-text=\"" + it.pager + ".page_to\"></span>\n  </span> of <span v-text=\"" + it.pager + ".size\"></span>\n  " + common_1.when(it.content_loc === 8, content) + "\n</div>";
}
exports.count_item = count_item;
function main(it, body) {
    return '';
}
exports.main = main;
//# sourceMappingURL=pager_controls.js.map