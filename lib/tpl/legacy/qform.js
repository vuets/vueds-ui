import { append } from '../common';
import { enum_options, option_empty, dpicker } from './form';
export function field_enum(it, fd, pojo, display) {
    return "\n<div class=\"fluid picker\">\n  <select v-disable=\"" + pojo + ".disable_\" v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"qform.$d.$change($event, " + pojo + ", " + fd._ + ", false, " + pojo + ", " + pojo + "$$)\">\n    <option value=\"\">" + display + "</option>" + enum_options(fd.v_fn(), fd.$v_fn()) + "\n  </select>\n</div>";
}
export function field_bool(it, fd, pojo, display) {
    return "\n<div class=\"fluid picker\">\n<select class=\"icons\" :class=\"{ active: " + pojo + "." + fd.$ + ", disabled: " + pojo + ".disable_ }\"\n    v-disable=\"" + pojo + ".disable_\" v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\"\n    @change=\"qform.$d.$change($event, " + pojo + ", " + fd._ + ", false, " + pojo + ", " + pojo + "$$)\">\n  <option value=\"\">" + display + ":</option>\n  <option value=\"1\">" + fd.$n + " &#xe9fc;</option>\n  <option value=\"0\">" + fd.$n + " &#xea00;</option>\n</select>\n</div>";
}
export function field_suggest(it, fd, pojo, display) {
    return "\n<div class=\"ui input\">\n  <input type=\"text\"\n      placeholder=\"" + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\"\n      v-suggest=\"{ pojo: " + pojo + ", field: '" + fd.$ + "', fetch: qform." + fd.$ + "$$AC }\" />\n</div>";
}
export function field_num(it, fd, pojo, display) {
    return "\n<div class=\"ui input\">\n  <input type=\"text\"" + (fd.o === 2 && dpicker(false, fd, pojo) || '') + "\n      placeholder=\"" + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\" v-sval:" + fd.t + append(fd.o, ',') + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"qform.$d.$change($event, " + pojo + ", " + fd._ + ", false, " + pojo + ", " + pojo + "$$)\" />\n</div>";
}
export function field_num_range(it, fd, pojo, display) {
    var sval = "" + fd.t + append(fd.o, ',');
    return "\n<div class=\"ui input\">\n  <input type=\"text\"" + (fd.o === 2 && dpicker(false, fd, pojo) || '') + "\n      placeholder=\"" + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\" v-sval:" + sval + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"qform.$d.$change($event, " + pojo + ", " + fd._ + ", false, " + pojo + ", " + pojo + "$$)\" />\n</div>\n<div class=\"ui input\">\n  <input type=\"text\"" + (fd.o === 2 && dpicker(false, fd, pojo + '$') || '') + "\n      placeholder=\"End " + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\" v-sval:" + sval + "=\"" + pojo + "$." + fd.$ + "\"\n      @change=\"qform.$d.$change($event, " + pojo + "$, " + fd._ + ", false, " + pojo + "$, " + pojo + "$$)\" />\n</div>";
}
export function field_default(it, fd, pojo, display, changeSuffix) {
    return "\n<div class=\"ui input\">\n  <input type=\"text\"\n      placeholder=\"" + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\" v-sval:" + fd.t + append(fd.o, ',') + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"qform.$d.$change($event, " + pojo + ", " + fd._ + ", false, " + pojo + ", " + pojo + "$$" + changeSuffix + ")\" />\n</div>";
}
export function filter_fields(it, jso, fields, pojo, nf) {
    var buf = '', descriptor = it.qd.$d, fd, fk, disable, display, item, suggestKind;
    buf += "<div class=\"field\" v-show=\"" + pojo + ".show__ && " + pojo + ".show_\">";
    for (var i = 0, len = fields.length; i < len; i++) {
        fk = String(fields[i]);
        if (jso['i' + fk])
            continue;
        fd = descriptor[fk];
        disable = pojo + '.disable_';
        if (jso['r' + fk])
            display = fd.$n + ' *';
        else
            display = fd.$n;
        suggestKind = jso['s' + fk];
        if (suggestKind) {
            buf += field_suggest(it, fd, pojo, display);
        }
        else if (fd.t === 1 /* BOOL */) {
            buf += field_bool(it, fd, pojo, display);
        }
        else if (fd.t === 16 /* ENUM */) {
            buf += field_enum(it, fd, pojo, display);
        }
        else if (fd.t !== 3 /* STRING */) {
            // check range
            buf += (jso['e' + fk] ? field_num_range(it, fd, pojo, display) : field_num(it, fd, pojo, display));
        }
        else if (jso['p' + fk]) {
            buf += field_default(it, fd, pojo, display, ', true');
        }
        else {
            buf += field_default(it, fd, pojo, display, '');
            // TODO range for string?
            if (jso['e' + fk]) {
            }
        }
    }
    buf += '</div>';
    return buf;
}
export function items(it, values) {
    var buf = '', qd = it.qd, key_array = qd.key_array, descriptor = qd.$d, jso;
    for (var i = 0, len = key_array.length; i < len; i++) {
        jso = qd[key_array[i]];
        if (!jso || !jso.fields)
            continue;
        buf += filter_fields(it, jso, jso.fields, "qform." + jso.$, String(values[i]));
    }
    return buf;
}
export function main(it) {
    var pager = it.pager || 'pager', qd = it.qd, values = qd.value_array, displayValues = qd.display_array;
    return "\n<div class=\"fluid picker\">\n  <select v-disable=\"" + pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + "\" @change=\"qform.change($event)\">\n  " + option_empty + "\n  " + enum_options(values, displayValues) + "\n  </select>\n</div>\n<form class=\"ui form\" onsubmit=\"return false;\">\n  " + items(it, values) + "\n</form>";
}
//# sourceMappingURL=qform.js.map