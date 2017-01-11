import { attr } from '../common';
export function change(it) {
    var flags = it.change_flags === undefined ? 4 /* CB_ONLY_ON_SET */ : it.change_flags, disable = it.disable_expr || "(" + it.pojo + "._.state & " + 8 /* LOADING */ + ")";
    return "\n<input type=\"text\" v-disable=\"" + disable + "\"" + attr(it, 'id') + attr(it, 'placeholder') + "\n    v-sval:" + 3 /* STRING */ + "=\"pnew." + it.field + "\"\n    @change=\"pnew.$d.$change($event, pnew, '" + it.field + "', false, null, " + it.handler + ", " + flags + ")\" />";
}
export function suggest(it) {
    var fetch = it.fetch, disable = it.disable_expr || "(" + it.pojo + "._.state & " + 8 /* LOADING */ + ")";
    if (fetch.charAt(0) === '/')
        fetch = "'" + fetch + "'";
    return "\n<input type=\"text\" v-disable=\"" + disable + "\"" + attr(it, 'id') + attr(it, 'placeholder') + "\n    v-suggest=\"{ pojo: " + it.pojo + ", field: '" + it.field + "', fetch: " + fetch + ", onSelect: " + it.handler + " }\" />";
}
//# sourceMappingURL=input.js.map