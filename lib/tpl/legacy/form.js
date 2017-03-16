import { when, when_fn, append, prepend, include_if, quote, attr } from '../common';
import * as $close from '../../_close';
import * as $dpicker from '../../_dpicker';
export var option_empty = '<option value=""></option>';
export function enum_options(arrayValue, arrayDisplay) {
    var out = '', len = arrayValue.length, i = 0;
    for (; i < len; i++)
        out += "<option value=\"" + arrayValue[i] + "\">" + arrayDisplay[i] + "</option>";
    return out;
}
function field_enum(it, fd, pojo, ffid) {
    return "\n<div class=\"fluid picker\">\n  <select" + include_if(ffid, ffid_attr, ffid) + " v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", " + !!it.update + append(pojo !== it.pojo && it.pojo, ', ') + ")\">\n    " + when(!it.update, option_empty) + enum_options(fd.v_fn(), fd.$v_fn()) + "\n  </select>\n</div>\n"; /**/
}
function field_bool_switch(it, fd, pojo, ffid) {
    return "\n<label class=\"switch\">\n  <input" + include_if(ffid, ffid_attr, ffid) + " type=\"checkbox\"\n      v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", " + !!it.update + append(pojo !== it.pojo && it.pojo, ', ') + ")\" />\n  <i></i> " + fd.$n + "\n</label>\n"; /**/
}
function field_bool(it, fd, pojo, ffid) {
    return "\n<div class=\"ui checkbox\">\n  <input" + include_if(ffid, ffid_attr, ffid) + " type=\"checkbox\"\n      v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", " + !!it.update + append(pojo !== it.pojo && it.pojo, ', ') + ")\" />\n</div>\n"; /**/
}
function field_textarea(it, fd, pojo, ffid) {
    return "\n<div class=\"ui input\">\n  <textarea" + include_if(ffid, ffid_attr, ffid) + " v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", " + !!it.update + append(pojo !== it.pojo && it.pojo, ', ') + ")\"></textarea>\n  " + include_if(fd.$h, help_text, fd) + "\n  <div v-text=\"!(" + pojo + "._.vfbs & " + (1 << (fd._ - 1)) + ") ? '' : " + pojo + "._['" + fd._ + "']\"></div>\n</div>\n"; /**/
}
export function dpicker(update, pojo, field) {
    return " v-dpicker:" + (32 /* TRIGGER_CHANGE_ON_SELECT */ | (update ? 16 /* UPDATE */ : 0)) + "=\"{ pojo: " + pojo + ", field: '" + field + "' }\"";
}
function field_num(it, fd, pojo, ffid) {
    return "\n<div class=\"ui input\">\n  <input" + include_if(ffid, ffid_attr, ffid) + " type=\"text\"" + (fd.o === 2 && dpicker(!!it.update, pojo, fd.$ || fd._) || '') + "\n      v-sval:" + fd.t + append(fd.o, ',') + "=\"" + pojo + "." + fd.$ + "\" @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", " + !!it.update + append(pojo !== it.pojo && it.pojo, ', ') + ")\" />\n  " + include_if(fd.$h, help_text, fd) + "\n  <div v-text=\"!(" + pojo + "._.vfbs & " + (1 << (fd._ - 1)) + ") ? '' : " + pojo + "._['" + fd._ + "']\"></div>\n</div>\n"; /**/
}
function field_default(it, fd, pojo, ffid) {
    return "\n<div class=\"ui input\">\n  <input" + include_if(ffid, ffid_attr, ffid) + " type=\"" + (fd.pw ? 'password' : 'text') + "\"\n      v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\" @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", " + !!it.update + append(pojo !== it.pojo && it.pojo, ', ') + ")\" />\n  " + include_if(fd.$h, help_text, fd) + "\n  <div v-text=\"!(" + pojo + "._.vfbs & " + (1 << (fd._ - 1)) + ") ? '' : " + pojo + "._['" + fd._ + "']\"></div>\n</div>\n"; /**/
}
function help_text(fd) {
    return "<div class=\"help-text\">" + fd.$h + "</div>"; /**/
}
function ffid_attr(ffid) {
    return " id=\"" + ffid + "\"";
}
function field_switch(it, fd, idx, pojo, ffid) {
    var buf = '', t = fd.t;
    if (!it.use_switch || t !== 1 /* BOOL */)
        buf += "<label>" + fd.$n + when(fd.m === 2, ' *') + "</label>";
    if (t === 1 /* BOOL */)
        buf += it.use_switch ? field_bool_switch(it, fd, pojo, ffid) : field_bool(it, fd, pojo, ffid);
    else if (t === 16 /* ENUM */)
        buf += field_enum(it, fd, pojo, ffid);
    else if (t !== 3 /* STRING */)
        buf += field_num(it, fd, pojo, ffid);
    else if (fd.ta)
        buf += field_textarea(it, fd, pojo, ffid);
    else
        buf += field_default(it, fd, pojo, ffid);
    return buf;
}
function show_field(it, expr) {
    return " v-show=\"" + expr + "\"";
}
function error_class(it, fd, pojo) {
    return " v-sclass:error=\"(" + pojo + "._.vfbs & " + (1 << (fd._ - 1)) + ") && " + pojo + "._['" + fd._ + "']\"";
}
function with_error(ft) {
    return ft !== 1 /* BOOL */ && ft !== 16 /* ENUM */;
}
function body(it, descriptor, pojo, root) {
    var out = '', array = descriptor.$fdf;
    if (descriptor.$fmf) {
        for (var _i = 0, _a = descriptor.$fmf; _i < _a.length; _i++) {
            var fk = _a[_i];
            var fd = descriptor[fk];
            out += body(it, fd.d_fn(), pojo + '.' + fd.$, root);
        }
    }
    if (!array)
        return out;
    var mask = it.update ? 13 : 3, exclude_fn = it.exclude_fn, show_fn = it.show_fn, ffid = root.ffid;
    if (ffid && array.length)
        root.ffid = null;
    for (var i = 0, len = array.length; i < len; i++) {
        var fk = array[i], fd = descriptor[fk], f = fd._;
        if (!fd.t || (fd.a & mask) || (exclude_fn && exclude_fn(f, descriptor)))
            continue;
        out += "\n<div class=\"field" + when(fd.m === 2, ' required') + "\"" + (with_error(fd.t) && error_class(it, fd, pojo) || '') + (show_fn ? when_fn(show_fn, f, descriptor, show_field, it) : '') + ">\n  " + field_switch(it, fd, i, pojo, ffid) + "\n</div>\n"; /**/
        ffid = null;
    }
    return out;
}
/** Alias to body. */
export function fields(it) {
    return body(it, it.$d, it.pojo, it);
}
function msg_show_update(pojo) {
    return " && (" + pojo + "._.state & " + 7 /* MASK_STATUS */ + ")";
}
// TODO v-show="${pojo}._.msg{{? it.update}} && (${pojo}._.state & {{c.MASK_STATUS}}){{?}}"
export function msg(pojo, update) {
    return "\n<div class=\"ui message\"\n    v-show=\"" + pojo + "._.msg" + include_if(update, msg_show_update, pojo) + "\"\n    v-pclass:status-=\"(" + pojo + "._.state & " + 7 /* MASK_STATUS */ + ")\">\n  <i class=\"icon close\" @click.prevent=\"" + pojo + "._.msg = null\"></i>\n  <span v-text=\"" + pojo + "._.msg\"></span>\n</div>\n"; /**/
}
export function toggle_el(it) {
    return "\n<hr/>\n<i class=\"icon resize-full\" v-itoggle:click,1,resize-small,resize-full=\"[ [" + quote(it.toggle_el) + "] ]\"></i>\n"; /**/
}
function close_el(it) {
    return "<i class=\"icon close\" v-close:click," + 8 /* SELECT_FROM_PARENT */ + "=\"" + quote(it.close_el) + "\"></i>"; /**/
}
export function title(it) {
    return "<p class=\"title\">" + it.title + "</p>"; /**/
}
export function disable_pager(it) {
    return "v-disable=\"" + prepend(it.disable_expr, ' || ') + "(" + it.pager + ".state & " + 8 /* LOADING */ + ")\"";
}
export function disable_expr(it) {
    return "v-disable=\"" + it.disable_expr + "\"";
}
// TODO v-xon="keyup{{? it.modal }}__{{pojo}}._.msg{{?}}:{{pojo}}._.msg = null | key esc"
export function main(it, content) {
    var pojo = it.pojo, tag = it.tag || 'form', disable = it.pager || it.disable_expr, btn_text = it.btn_text || (it.update ? 'Update' : 'Submit');
    return "\n" + (it.toggle_el && toggle_el(it) ||
        it.hr_before && '<hr />' ||
        it.close_el && close_el(it) || '') + "\n<" + tag + " class=\"ui form\"" + attr(it, 'id') + attr(it, 'show_expr', 'v-show') + "\n    v-clear v-pclass:status-=\"(" + pojo + "._.state & " + 7 /* MASK_STATUS */ + ")\">\n  " + include_if(it.title, title, it) + "\n  " + when(it.content_slot === 0 /* TOP */, content) + "\n  " + (!it.without_fields && body(it, it.$d, pojo, it) || '') + "\n  " + when(it.content_slot === 1 /* BEFORE_BUTTON */, content) + "\n  " + (!it.without_msg && msg(it.pojo, it.update) || '') + "\n  <button type=\"submit\" class=\"ui fluid submit button" + append(it.btn_class) + "\"\n      " + (disable && (it.pager && disable_pager(it) || it.disable_expr && disable_expr(it)) || '') + "\n      @click.prevent=\"" + it.on_submit + "\">\n    " + btn_text + "\n  </button>\n</" + tag + ">\n" + when(it.hr_after, '<hr />') + "\n"; /**/
}
//# sourceMappingURL=form.js.map