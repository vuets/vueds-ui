import { include_if, when, tern_yes_no, attrs } from '../common';
function track_clicks(it) {
    return ", (" + it.pager + ".$clicks ^= 1)";
}
export function msg_fragment(it) {
    var pager = it.pager;
    return "\n<div v-show=\"" + pager + ".msg && (" + pager + ".state & " + 7 /* MASK_STATUS */ + ")\">\n  <div class=\"ui message\" v-pclass:status-=\"(" + pager + ".state & " + 7 /* MASK_STATUS */ + ")\">\n    <i class=\"close icon\" @click.prevent=\"" + pager + ".msg = null\"></i>\n    <span v-text=\"" + pager + ".msg\"></span>\n  </div>\n</div>\n"; /**/
}
export function sort_btn(it) {
    var pager = it.pager;
    return "\n<button type=\"button\" class=\"ui button\"\n    v-disable=\"2 > " + pager + ".size || (" + pager + ".state & " + 8 /* LOADING */ + ")\"\n    @click.prevent=\"pager.store.repaint(\n        (" + pager + ".state ^= " + 16 /* DESC */ + ")" + include_if(it.track_clicks, track_clicks, it) + ")\">\n  <i class=\"icon\" v-pclass:desc-=\"" + pager + ".state & " + 16 /* DESC */ + " ? " + tern_yes_no(!it.reverse_icon) + "\"></i>\n</button>\n"; /**/
}
export function rpc_newer_btn(it) {
    return "\n<button type=\"button\" class=\"ui button\" \n    v-disable=\"(" + it.pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + ")\"\n    @click.prevent=\"" + it.pager + ".store.pagePrevOrLoad(" + (it.flags || 0) + include_if(it.track_clicks, track_clicks, it) + ")\">\n  <i class=\"icon reply\"></i>\n</button>\n"; /**/
}
export function rpc_older_btn(it) {
    return "\n<button type=\"button\" class=\"ui button\"\n    v-disable=\"(" + it.pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + ") || " + it.pager + ".size === 0\"\n    @click.prevent=\"" + it.pager + ".store.pageNextOrLoad(" + (it.flags || 0) + include_if(it.track_clicks, track_clicks, it) + ")\">\n  <i class=\"icon forward\"></i>\n</button>\n"; /**/
}
export function rpc_reload_btn(it) {
    return "\n<button type=\"button\" class=\"ui button\"\n    v-disable=\"(" + it.pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + ") || " + it.pager + ".size === 0\"\n    @click.prevent=\"" + it.pager + ".store.reload(" + include_if(it.track_clicks, track_clicks, it) + ")\">\n  <i class=\"icon cw\"></i>\n</button>\n"; /**/
}
export function rpc_item(it) {
    return "\n<div class=\"item\">\n  <div class=\"ui tiny icon buttons\">\n    " + when(it.content_slot === 1 /* RPC_FIRST */, it._content) + "\n    " + include_if(!it.without_sort, sort_btn, it) + "\n    " + include_if(!it.without_rpc_newer, rpc_newer_btn, it) + "\n    " + include_if(!it.without_rpc_older, rpc_older_btn, it) + "\n    " + include_if(!it.without_rpc_reload, rpc_reload_btn, it) + "\n    " + when(it.content_slot === 2 /* RPC_LAST */, it._content) + "\n  </div>\n</div>\n"; /**/
}
export function nav_item(it) {
    var pager = it.pager, track_clicks_ = include_if(it.track_clicks, track_clicks, it);
    return "\n<div class=\"item\">\n  <div class=\"ui tiny slim icon buttons\">\n    " + when(it.content_slot === 4 /* NAV_FIRST */, it._content) + "\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"(" + pager + ".state & " + 8 /* LOADING */ + ") || " + pager + ".page === 0\"\n        @click.prevent=\"" + pager + ".store.repaint((" + pager + ".page = 0)" + track_clicks_ + ")\">\n      <i class=\"icon angle-double-left\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\" \n        v-disable=\"(" + pager + ".state & " + 8 /* LOADING */ + ") || " + pager + ".page === 0\"\n        @click.prevent=\"" + pager + ".store.repaint(--" + pager + ".page" + track_clicks_ + ")\">\n      <i class=\"icon angle-left\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"(" + pager + ".state & " + 8 /* LOADING */ + ") || " + pager + ".page === " + pager + ".page_count\"\n        @click.prevent=\"" + pager + ".store.repaint(++" + pager + ".page" + track_clicks_ + ")\">\n        <i class=\"icon angle-right\"></i>\n    </button>\n    <button type=\"button\" class=\"ui button\"\n        v-disable=\"(" + pager + ".state & " + 8 /* LOADING */ + ") || " + pager + ".page === " + pager + ".page_count\"\n        @click.prevent=\"" + pager + ".store.repaint((" + pager + ".page = " + pager + ".page_count)" + track_clicks_ + ")\">\n      <i class=\"icon angle-double-right\"></i>\n    </button>\n    " + when(it.content_slot === 5 /* NAV_LAST */, it._content) + "\n  </div>\n</div>\n"; /**/
}
export function count_item(it) {
    var pager = it.pager;
    return "\n<div class=\"item\">\n  " + when(it.content_slot === 7 /* COUNT_FIRST */, it._content) + "\n  <span v-show=\"" + pager + ".size !== 0\" v-text=\"" + pager + ".page_from\"></span>\n  <span v-show=\"" + pager + ".page_from !== " + pager + ".page_to\">\n  <span v-show=\"" + pager + ".size !== 0\" >-</span>\n  <span v-text=\"" + pager + ".page_to\"></span>\n  </span> of <span v-text=\"" + pager + ".size\"></span>\n  " + when(it.content_slot === 8 /* COUNT_LAST */, it._content) + "\n</div>\n"; /**/
}
function list_class(it) {
    return " " + it.list_class;
}
export function main(it, content) {
    it._content = content;
    return "\n" + include_if(!it.without_msg && it.top, msg_fragment, it) + "\n<div class=\"ui skimped tiny horizontal list" + include_if(it.list_class, list_class, it) + "\"" + attrs(it.attrs) + ">\n  " + when(it.content_slot === 0 /* FIRST */, it._content) + "\n  " + include_if(!it.without_rpc, rpc_item, it) + "\n  " + when(it.content_slot === 3 /* BEFORE_NAV */, it._content) + "\n  " + include_if(!it.without_nav, nav_item, it) + "\n  " + when(it.content_slot === 6 /* BEFORE_COUNT */, it._content) + "\n  " + include_if(!it.without_count, count_item, it) + "\n  " + when(it.content_slot === 9 /* LAST */, it._content) + "\n</div>\n" + include_if(!it.without_msg && !it.top, msg_fragment, it) + "\n"; /**/
}
//# sourceMappingURL=pager_controls.js.map