import { when, when_fn, append, prepend, include_if, anchor, quote } from '../common';
var option_empty = '<option value=""></option>';
function enum_options(fd) {
    var out = '', arrayValue = fd.v_fn(), arrayDisplay = fd.$v_fn(), len = arrayValue.length, i = 0;
    for (i = 0; i < len; i++)
        out += "<option value=\"" + arrayValue[i] + "\">" + arrayDisplay[i] + "</option>";
    return out;
}
function field_enum(it, fd, idx, pojo, ffid) {
    return "\n<div class=\"fluid picker\">\n  <select" + include_if(ffid, ffid_attr, ffid) + " v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", " + !!it.update + ")\">\n    " + when(!it.update, option_empty) + enum_options(fd) + "\n  </select>\n</div>";
}
// TODO call the change function?
function field_bool(it, fd, idx, pojo, ffid) {
    return "\n<div class=\"ui checkbox\">\n  <input" + include_if(ffid, ffid_attr, ffid) + " type=\"checkbox\"\n      v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\" @change=\"" + pojo + "." + fd.$ + " = $event.target.checked\" />\n</div>";
}
function field_textarea(it, fd, idx, pojo, ffid) {
    return "\n<div class=\"ui input\">\n  <textarea" + include_if(ffid, ffid_attr, ffid) + " v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", " + !!it.update + ")\"></textarea>\n  " + include_if(fd.$h, help_text, fd) + "\n  <div v-text=\"" + pojo + "._['" + fd._ + "']\"></div>\n</div>";
}
function field_default(it, fd, idx, pojo, ffid) {
    return "\n<div class=\"ui input\">\n  <input" + include_if(ffid, ffid_attr, ffid) + " type=\"" + (fd.pw ? 'password' : 'text') + "\"\n      v-sval:" + fd.t + append(fd.o, ',') + "=\"" + pojo + "." + fd.$ + "\" @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", " + !!it.update + ")\" />\n  " + include_if(fd.$h, help_text, fd) + "\n  <div v-text=\"" + pojo + "._['" + fd._ + "']\"></div>\n</div>";
}
function help_text(fd) {
    return "<div class=\"help-text\">" + fd.$h + "</div>";
}
function ffid_attr(ffid) {
    return " id=\"" + ffid + "\"";
}
function field_switch(it, fd, idx, pojo, ffid) {
    var t = fd.t;
    if (t === 1)
        return field_bool(it, fd, idx, pojo, ffid);
    if (t === 16)
        return field_enum(it, fd, idx, pojo, ffid);
    if (fd.ta)
        return field_textarea(it, fd, idx, pojo, ffid);
    return field_default(it, fd, idx, pojo, ffid);
}
function show_field(it, expr) {
    return " v-show=\"" + expr + "\"";
}
function body(it, descriptor, pojo, root) {
    var array = descriptor.$fdf, mask = it.update ? 13 : 3, out = '', exclude_fn = it.exclude_fn, show_fn = it.show_fn, ffid;
    if (descriptor.$fmf) {
        for (var _i = 0, _a = descriptor.$fmf; _i < _a.length; _i++) {
            var fk = _a[_i];
            var fd = descriptor[fk];
            out += body(it, fd.d_fn(), pojo + '.' + fd.$, root);
        }
    }
    ffid = root.ffid;
    if (ffid && array.length)
        root.ffid = null;
    for (var i = 0, len = array.length; i < len; i++) {
        var fk = array[i], fd = descriptor[fk], f = fd._;
        if (!fd.t || (fd.a & mask) || (exclude_fn && exclude_fn(f, descriptor)))
            continue;
        out += "\n<div" + (show_fn ? when_fn(show_fn, f, descriptor, show_field, it) : '') + " class=\"field" + when(fd.m === 2, ' required') + "\"\n    v-sclass:error=\"" + pojo + "._['" + fd._ + "']\">\n  <label>" + fd.$n + (when(fd.m === 2), ' *') + "</label>\n  " + field_switch(it, fd, i, pojo, ffid) + "\n</div>\n        ";
        ffid = null;
    }
    return out;
}
export function fields(it, content) {
    return "\n" + (typeof content === 'string' ? content : anchor) + "\n" + body(it, it.$d, it.pojo, it);
}
function msg_show_update(it) {
    return " && (" + it.pojo + "._.state & " + 7 /* MASK_STATUS */ + ")";
}
// TODO v-show="${pojo}._.msg{{? it.update}} && (${pojo}._.state & {{c.MASK_STATUS}}){{?}}"
export function msg(it) {
    var pojo = it.pojo;
    return "\n<div class=\"ui message\"\n    v-show=\"" + pojo + "._.msg" + include_if(it.update, msg_show_update, it) + "\"\n    v-pclass:status-=\"(" + pojo + "._.state & " + 7 /* MASK_STATUS */ + ")\">\n  <i class=\"icon close\" @click.prevent=\"" + pojo + "._.msg = null\"></i>\n  <span v-text=\"" + pojo + "._.msg\"></span>\n</div>";
}
export function toggle_el(it) {
    return "\n<hr/>\n<i class=\"icon resize-full\" v-itoggle:click,1,resize-small,resize-full=\"[ [" + quote(it.toggle_el) + "] ]\"></i>";
}
function close_el(it) {
    return "<i class=\"icon close\" v-close:click," + 8 /* SELECT_FROM_PARENT */ + "=\"" + quote(it.close_el) + "\"></i>";
}
export function title(it) {
    return "<p class=\"title\">" + it.title + "</p>";
}
export function disable_pager(it) {
    return "v-disable=\"" + prepend(it.disable_expr, ' || ') + "(" + it.pager + ".state & " + 8 /* LOADING */ + ")\"";
}
export function disable_expr(it) {
    return "v-disable=\"" + it.disable_expr + "\"";
}
// TODO v-xon="keyup{{? it.modal }}__{{pojo}}._.msg{{?}}:{{pojo}}._.msg = null | key esc"
export function main(it, content) {
    it._content = typeof content === 'string' ? content : anchor;
    if (!it.pojo)
        it.pojo = 'pojo';
    var pojo = it.pojo, tag = it.tag || 'form', disable = it.pager || it.disable_expr, btn_text = it.btn_text || 'Submit';
    return "\n" + (it.toggle_el && toggle_el(it) ||
        it.hr_before && '<hr />' ||
        it.close_el && close_el(it) || '') + "\n<" + tag + " class=\"ui form\"\n    v-clear v-pclass:status-=\"(" + pojo + "._.state & " + 7 /* MASK_STATUS */ + ")\">\n  " + include_if(it.title, title, it) + "\n  " + when(it.content_slot === 0 /* TOP */, it._content) + "\n  " + (!it.without_fields && body(it, it.$d, pojo, it) || '') + "\n  " + when(it.content_slot === 1 /* BEFORE_BUTTON */, it._content) + "\n  " + include_if(!it.without_msg, msg, it) + "\n  <button type=\"submit\" class=\"ui fluid submit button" + append(it.btn_class) + "\"\n      " + (disable && (it.pager && disable_pager(it) || it.disable_expr && disable_expr(it)) || '') + "\n      @click.prevent=\"" + it.on_submit + "\">\n    " + btn_text + "\n  </button>\n</" + tag + ">\n" + when(it.hr_after, '<hr />') + "\n";
}
//# sourceMappingURL=form.js.map