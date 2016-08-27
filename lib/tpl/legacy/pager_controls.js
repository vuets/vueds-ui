import { include_if, when, anchor, tern_yes_no } from '../common';
function track_clicks(it) {
    return ", (" + it.pager + ".$clicks ^= 1)";
}
export function msg_fragment(it) {
    var pager = it.pager;
    return "\n<div v-show=\"" + pager + ".msg && (" + pager + ".state & " + 7 /* MASK_STATUS */ + ")\">\n  <div class=\"ui message\"\n      v-pclass:status-=\"" + pager + ".state & " + 7 /* MASK_STATUS */ + "\">\n    <i class=\"close icon\" @click.prevent=\"" + pager + ".msg = null\"></i>\n    <span v-text=\"" + pager + ".msg\"></span>\n  </div>\n</div>";
}
export function sort_btn(it) {
    var pager = it.pager;
    return "\n<button type=\"button\" class=\"ui button\"\n    v-disable=\"2 > " + pager + ".size || (" + pager + ".state & " + 8 /* LOADING */ + ")\"\n    @click.prevent=\"pager.store.repaint(\n        (" + pager + ".state ^= " + 16 /* DESC */ + include_if(it.track_clicks, track_clicks, it) + "))\">\n  <i class=\"icon\" v-pclass:desc-=\"" + pager + ".state & " + 16 /* DESC */ + " ? " + tern_yes_no(!it.reverse_icon) + "\"></i>\n</button>";
}
export function rpc_newer_btn(it) {
    return "\n<button type=\"button\" class=\"ui button\" \n    v-disable=\"" + it.pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + "\"\n    v-xon=\"click:" + it.pager + ".$handle(16, " + (it.flags || 0) + include_if(it.track_clicks, track_clicks, it) + ")\">\n  <i class=\"reply mail icon\"></i>\n</button>";
}
export function rpc_older_btn(it) {
    return "\n<button type=\"button\" class=\"ui button\"\n    v-disable=\"" + it.pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + " || " + it.pager + ".size === 0\"\n    v-xon=\"click:" + it.pager + ".$handle(17, " + (it.flags || 0) + include_if(it.track_clicks, track_clicks, it) + ")\">\n  <i class=\"forward mail icon\"></i>\n</button>";
}
export function rpc_reload_btn(it) {
    return "\n<button type=\"button\" class=\"ui button\"\n    v-disable=\"" + it.pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + " || " + it.pager + ".size === 0\"\n    v-xon=\"click:" + it.pager + ".$handle(4" + include_if(it.track_clicks, track_clicks, it) + ")\">\n  <i class=\"repeat icon\"></i>\n</button>";
}
export function rpc_item(it) {
    return "\n<div>\n  <div class=\"ui tiny icon buttons\">\n    " + when(it.content_loc === 1, it._content) + "\n    " + include_if(!it.without_sort, sort_btn, it) + "\n    " + include_if(!it.without_rpc_newer, rpc_newer_btn, it) + "\n    " + include_if(!it.without_rpc_older, rpc_older_btn, it) + "\n    " + include_if(!it.without_rpc_reload, rpc_reload_btn, it) + "\n    " + when(it.content_loc === 2, it._content) + "\n  </div>\n</div>";
}
export function nav_item(it) {
    return "\n<div class=\"item\">\n  <div class=\"ui tiny icon buttons\">\n    " + when(it.content_loc === 4, it._content) + "\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"" + it.pager + ".state & " + 8 /* LOADING */ + " || " + it.pager + ".page === 0\"\n        v-xon=\"click:" + it.pager + ".$handle(1, (" + it.pager + ".page = 0)" + include_if(it.track_clicks, track_clicks, it) + ")\">\n        <i class=\"double angle left icon\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\" \n        v-disable=\"" + it.pager + ".state & " + 8 /* LOADING */ + " || " + it.pager + ".page === 0\"\n        v-xon=\"click:" + it.pager + ".$handle(1, --" + it.pager + ".page" + include_if(it.track_clicks, track_clicks, it) + ")\">\n        <i class=\"angle left icon\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"" + it.pager + ".state & " + 8 /* LOADING */ + " || " + it.pager + ".page === " + it.pager + ".page_count\"\n        v-xon=\"click:" + it.pager + ".$handle(1, ++" + it.pager + ".page" + include_if(it.track_clicks, track_clicks, it) + ")\">\n        <i class=\"angle right icon\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"" + it.pager + ".state & " + 8 /* LOADING */ + " || " + it.pager + ".page === " + it.pager + ".page_count\"\n        v-xon=\"click:" + it.pager + ".$handle(1, \n            (" + it.pager + ".page = " + it.pager + ".page_count)" + include_if(it.track_clicks, track_clicks, it) + ")\">\n        <i class=\"double angle right icon\"></i>\n    </button>\n    " + when(it.content_loc === 5, it._content) + "\n  </div>\n</div>";
}
export function count_item(it) {
    return "\n<div class=\"item\">\n  " + when(it.content_loc === 7, it._content) + "\n  <span v-show=\"" + it.pager + ".size !== 0\" v-text=\"" + it.pager + ".page_from\"></span>\n  <span v-show=\"" + it.pager + ".page_from !== " + it.pager + ".page_to\">\n  <span v-show=\"" + it.pager + ".size !== 0\" >-</span>\n  <span v-text=\"" + it.pager + ".page_to\"></span>\n  </span> of <span v-text=\"" + it.pager + ".size\"></span>\n  " + when(it.content_loc === 8, it._content) + "\n</div>";
}
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
export function main(it, body) {
    it._content = body || anchor;
    return "\n" + include_if(!it.without_msg && it.top, msg_fragment, it) + "\n<div class=\"ui tiny horizontal list" + include_if(it.list_class, list_class, it) + "\"" + include_if(it.attrs, attrs, it) + ">\n  " + when(it.content_loc === 0, it._content) + "\n  " + include_if(!it.without_rpc, rpc_item, it) + "\n  " + when(it.content_loc === 3, it._content) + "\n  " + include_if(!it.without_nav, nav_item, it) + "\n  " + when(it.content_loc === 6, it._content) + "\n  " + include_if(!it.without_count, count_item, it) + "\n  " + when(it.content_loc === 9, it._content) + "\n</div>\n" + include_if(!it.without_msg && !it.top, msg_fragment, it) + "\n";
}
//# sourceMappingURL=pager_controls.js.map