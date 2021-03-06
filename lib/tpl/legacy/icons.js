import { append } from '../common';
function timeago_rev(pojo) {
    return "\n<i class=\"icon pencil\" v-show=\"" + pojo + ".rev\" :title=\"" + pojo + ".rev\"></i><span v-show=\"" + pojo + ".rev\">{{ " + pojo + ".updateTs | prettydate }}</span>\n"; /**/
}
export function timeago(it) {
    var pojo = it.pojo;
    return "\n<i class=\"icon clock" + append(it.icon_class) + "\"></i>{{ " + pojo + ".ts | prettydate }}\n" + (!it.skip_rev && timeago_rev(pojo) || '') + "\n"; /**/
}
export function toggle(it) {
    var pojo = it.pojo, bit = it.bit, title_expr = !it.title_expr ? '' : (" :title=\"" + it.title_expr + "\"");
    return "\n<i class=\"icon action " + (it.icon_class || 'circle') + "\" v-sclass:empty=\"!" + pojo + "." + it.field + "\" @click=\"(" + pojo + "._.state ^= " + bit + ")\"" + title_expr + "></i>\n<i class=\"icon action ok-circled\" v-show=\"(" + pojo + "._.state & " + bit + ")\" @click=\"" + it.fn + "(" + pojo + ", '" + it.field + "', " + pojo + "._.state ^= " + bit + ")\"></i>\n<i class=\"icon action cancel-circled\" v-show=\"(" + pojo + "._.state & " + bit + ")\" @click=\"(" + pojo + "._.state ^= " + bit + ")\"></i>\n"; /**/
}
export function drawer(it, content) {
    var pojo = it.pojo, bit = it.bit, tabindex = it.tabindex === undefined ? '' : ' tabindex="0"', append = !it.form ? '' : " v-append:" + it.form + "=\"(" + pojo + "._.state & " + bit + ")\"", call_expr;
    if (it.fn) {
        call_expr = it.fn + "((" + pojo + "._.state ^= " + bit + "))";
    }
    else if (it.form) {
        call_expr = it.form + "$$A((" + pojo + "._.state ^= " + bit + "))";
    }
    else {
        call_expr = "(" + pojo + "._.state ^= " + bit + ")";
    }
    return "\n<div class=\"content\" @click=\"" + call_expr + "\">\n  <i " + tabindex + "class=\"icon action\" v-pclass:angle-=\"(" + pojo + "._.state & " + bit + ") ? 'down' : 'right'\"></i>" + (content || '') + "\n</div>\n<dd v-show=\"(" + pojo + "._.state & " + bit + ")\"" + append + "></dd>\n"; /**/
}
//# sourceMappingURL=icons.js.map