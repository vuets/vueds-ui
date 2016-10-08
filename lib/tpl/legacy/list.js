import { attrs, exprs, or, append, prepend, include_if } from '../common';
function list_class(it) {
    return prepend(it.list_class) + "small divided selection";
}
function click_to_select(it) {
    return "@click=\"" + it.pager + ".store.select(" + it.pojo + ", " + 1 /* CLICKED */ + ", " + it.pojo + ".$index)\"";
}
function item_class_exprs(it) {
    return ":class=\"{ active: (" + it.pojo + "._.lstate & " + 2 /* SELECTED */ + ")" + exprs(it.item_class_exprs) + " }\"";
}
function item_class_expr(it) {
    return "v-sclass:active=\"(" + it.pojo + "._.lstate & " + 2 /* SELECTED */ + ")\"";
}
export function main(it, content) {
    if (!it.pojo)
        it.pojo = 'pojo';
    var pager = it.pager, pojo = it.pojo;
    return "\n<ul class=\"ui " + or(it.custom_list_class, list_class, it) + " list\"" + attrs(it.attrs) + ">\n  <li v-for=\"" + pojo + " in " + pager + ".array\" v-defp:pager_item=\"" + it.pojo + "\" class=\"item" + append(it.item_class) + "\"" + attrs(it.item_attrs) + "\n      " + include_if(it.click_to_select, click_to_select, it) + "\n      v-show=\"(" + pojo + "._.lstate & " + 1 /* INCLUDED */ + ")" + append(it.item_show_expr, ' && ') + "\"\n      " + (it.item_class_exprs && item_class_exprs(it) || item_class_expr(it)) + ">\n    " + content + "\n    <div v-show=\"" + pojo + "._.msg\">\n      <div class=\"ui message\" v-pclass:status-=\"(" + pojo + "._.state & " + 7 /* MASK_STATUS */ + ")\">\n        <i class=\"close icon\" @click.prevent=\"" + pojo + "._.msg = null\"></i>\n        <span v-text=\"" + pojo + "._.msg\"></span>\n      </div>\n    </div>\n  </li>\n</ul>";
}
//# sourceMappingURL=list.js.map