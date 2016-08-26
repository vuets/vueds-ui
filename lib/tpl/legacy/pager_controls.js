"use strict";
var common_1 = require('../common');
function track_clicks(it) {
    return ", (" + it.pager + ".$clicks ^= 1)";
}
function msg_fragment(it) {
    var pager = it.pager;
    return "\n<div v-show=\"" + pager + ".msg && (" + pager + ".state & " + 7 /* MASK_STATUS */ + ")\">\n  <div class=\"ui message\"\n      v-pclass:status-=\"" + pager + ".state & " + 7 /* MASK_STATUS */ + "\">\n    <i class=\"close icon\" @click.prevent=\"" + pager + ".msg = null\"></i>\n    <span v-text=\"" + pager + ".msg\"></span>\n  </div>\n</div>";
}
exports.msg_fragment = msg_fragment;
function sort_btn(it) {
    var pager = it.pager;
    return "\n<button type=\"button\" class=\"ui button\"\n    v-disable=\"2 > " + pager + ".size || (" + pager + ".state & " + 8 /* LOADING */ + ")\"\n    @click.prevent=\"pager.store.repaint(\n        (" + pager + ".state ^= " + 16 /* DESC */ + common_1.include_if(it.track_clicks, track_clicks, it) + "))\">\n  <i class=\"icon\" v-pclass:desc-=\"" + pager + ".state & " + 16 /* DESC */ + " ? " + common_1.tern_yes_no(!it.reverse_icon) + "\"></i>\n</button>";
}
exports.sort_btn = sort_btn;
function rpc_newer_btn(it) {
    return "\n<button type=\"button\" class=\"ui button\" \n    v-disable=\"" + it.pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + "\"\n    v-xon=\"click:" + it.pager + ".$handle(16, " + (it.flags || 0) + common_1.include_if(it.track_clicks, track_clicks, it) + ")\">\n  <i class=\"reply mail icon\"></i>\n</button>";
}
exports.rpc_newer_btn = rpc_newer_btn;
function rpc_older_btn(it) {
    return "\n<button type=\"button\" class=\"ui button\"\n    v-disable=\"" + it.pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + " || " + it.pager + ".size === 0\"\n    v-xon=\"click:" + it.pager + ".$handle(17, " + (it.flags || 0) + common_1.include_if(it.track_clicks, track_clicks, it) + ")\">\n  <i class=\"forward mail icon\"></i>\n</button>";
}
exports.rpc_older_btn = rpc_older_btn;
function rpc_reload_btn(it) {
    return "\n<button type=\"button\" class=\"ui button\"\n    v-disable=\"" + it.pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + " || " + it.pager + ".size === 0\"\n    v-xon=\"click:" + it.pager + ".$handle(4" + common_1.include_if(it.track_clicks, track_clicks, it) + ")\">\n  <i class=\"repeat icon\"></i>\n</button>";
}
exports.rpc_reload_btn = rpc_reload_btn;
function rpc_item(it) {
    return "\n<div>\n  <div class=\"ui tiny icon buttons\">\n    " + common_1.when(it.content_loc === 1, it._content) + "\n    " + common_1.include_if(!it.without_sort, sort_btn, it) + "\n    " + common_1.include_if(!it.without_rpc_newer, rpc_newer_btn, it) + "\n    " + common_1.include_if(!it.without_rpc_older, rpc_older_btn, it) + "\n    " + common_1.include_if(!it.without_rpc_reload, rpc_reload_btn, it) + "\n    " + common_1.when(it.content_loc === 2, it._content) + "\n  </div>\n</div>";
}
exports.rpc_item = rpc_item;
function nav_item(it) {
    return "\n<div class=\"item\">\n  <div class=\"ui tiny icon buttons\">\n    " + common_1.when(it.content_loc === 4, it._content) + "\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"" + it.pager + ".state & " + 8 /* LOADING */ + " || " + it.pager + ".page === 0\"\n        v-xon=\"click:" + it.pager + ".$handle(1, (" + it.pager + ".page = 0)" + common_1.include_if(it.track_clicks, track_clicks, it) + ")\">\n        <i class=\"double angle left icon\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\" \n        v-disable=\"" + it.pager + ".state & " + 8 /* LOADING */ + " || " + it.pager + ".page === 0\"\n        v-xon=\"click:" + it.pager + ".$handle(1, --" + it.pager + ".page" + common_1.include_if(it.track_clicks, track_clicks, it) + ")\">\n        <i class=\"angle left icon\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"" + it.pager + ".state & " + 8 /* LOADING */ + " || " + it.pager + ".page === " + it.pager + ".page_count\"\n        v-xon=\"click:" + it.pager + ".$handle(1, ++" + it.pager + ".page" + common_1.include_if(it.track_clicks, track_clicks, it) + ")\">\n        <i class=\"angle right icon\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"" + it.pager + ".state & " + 8 /* LOADING */ + " || " + it.pager + ".page === " + it.pager + ".page_count\"\n        v-xon=\"click:" + it.pager + ".$handle(1, \n            (" + it.pager + ".page = " + it.pager + ".page_count)" + common_1.include_if(it.track_clicks, track_clicks, it) + ")\">\n        <i class=\"double angle right icon\"></i>\n    </button>\n    " + common_1.when(it.content_loc === 5, it._content) + "\n  </div>\n</div>";
}
exports.nav_item = nav_item;
function count_item(it) {
    return "\n<div class=\"item\">\n  " + common_1.when(it.content_loc === 7, it._content) + "\n  <span v-show=\"" + it.pager + ".size !== 0\" v-text=\"" + it.pager + ".page_from\"></span>\n  <span v-show=\"" + it.pager + ".page_from !== " + it.pager + ".page_to\">\n  <span v-show=\"" + it.pager + ".size !== 0\" >-</span>\n  <span v-text=\"" + it.pager + ".page_to\"></span>\n  </span> of <span v-text=\"" + it.pager + ".size\"></span>\n  " + common_1.when(it.content_loc === 8, it._content) + "\n</div>";
}
exports.count_item = count_item;
function list_class(it) {
    return " " + it.list_class;
}
function attrs(it) {
    var buf = ' ';
    for (var i in attrs) {
        buf += i + '="' + attrs[i] + '"';
    }
    return buf;
}
function main(it, body) {
    it._content = body || common_1.anchor;
    return "\n" + common_1.include_if(!it.without_msg && it.top, msg_fragment, it) + "\n<div class=\"ui tiny horizontal list" + common_1.include_if(it.list_class, list_class, it) + "\"" + common_1.include_if(it.attrs, attrs, it) + ">\n  " + common_1.when(it.content_loc === 0, it._content) + "\n  " + common_1.include_if(!it.without_rpc, rpc_item, it) + "\n  " + common_1.when(it.content_loc === 3, it._content) + "\n  " + common_1.include_if(!it.without_nav, nav_item, it) + "\n  " + common_1.when(it.content_loc === 6, it._content) + "\n  " + common_1.include_if(!it.without_count, count_item, it) + "\n  " + common_1.when(it.content_loc === 9, it._content) + "\n</div>\n" + common_1.include_if(!it.without_msg && !it.top, msg_fragment, it) + "\n";
}
exports.main = main;
//# sourceMappingURL=pager_controls.js.map