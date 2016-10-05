import { attr } from '../common';
function itoggle_id(it) {
    return "\n<div class=\"item\">\n  <a v-itoggle=\"click,1,resize-small,resize-full:[ ['" + it.itoggle_id + "'] ]\">\n    <i class=\"icon resize-full\"></i>\n  </a>\n</div>";
}
function dropdown(it, content) {
    return "\n<div class=\"item\">\n  <div class=\"dropdown\"" + attr(it, "id") + ">\n    <div v-toggle=\"'1'\"><i class=\"icon down-dir\"></i></div>\n    <ul class=\"dropdown-menu\" v-close=\"'1'\">\n      " + content + "\n    </ul>\n  </div>\n</div>";
}
export function right_menu(it, content) {
    return "\n<div class=\"right menu\">\n  " + (it.itoggle_id && itoggle_id(it) || '') + "\n  " + (it.content_loc === 1 /* RIGHT_MENU */ && content || '') + "\n  " + (!it.content_loc && content && dropdown(it, content) || '') + "\n</div>";
}
export function simple(it, content) {
    return "\n<div class=\"ui attached large secondary pointing menu\">\n  <div class=\"item\">\n    <div class=\"ui small further left icon input\">\n      <input type=\"text\" placeholder=\"" + it.title + "\" disabled />\n    </div>\n  </div>\n  " + right_menu(it, content) + "\n</div>";
}
function disable(it, dpager) {
    return " v-disable=\"(" + dpager + ".state & " + 8 /* LOADING */ + ") || (!" + dpager + ".size && !(" + dpager + ".state & " + 256 /* LOCAL_SEARCH */ + "))\"";
}
export function pager(it, content) {
    var dpager = it.dpager || it.pager;
    return "\n<div class=\"ui attached large secondary pointing menu\">\n  <div class=\"item\">\n    <div class=\"ui small further left icon input\">\n      <input type=\"text\" placeholder=\"" + it.title + "\"" + disable(it, it.dpager || it.pager) + "\n          v-lsearch=\"{ pager: " + it.pager + ", fields: ['" + it.search_fk + "'] }\" />\n      <i class=\"icon search\"></i>\n    </div>\n  </div>\n  " + right_menu(it, content) + "\n</div>";
}
//# sourceMappingURL=menu.js.map