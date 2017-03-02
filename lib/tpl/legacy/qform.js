import { append } from '../common';
import { enum_options, option_empty, dpicker } from './form';
export function field_enum(fd, pojo, display, custom_class, content) {
    return "\n<div class=\"" + (custom_class || 'fluid picker') + "\">\n  <select v-disable=\"" + pojo + ".disable_\" v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", false, null, " + pojo + "$$)\">\n    <option value=\"\">" + display + "</option>" + enum_options(fd.v_fn(), fd.$v_fn()) + "\n  </select>" + (content || '') + "\n</div>\n"; /**/
}
export function field_bool(fd, pojo, display, custom_class, content) {
    return "\n<div class=\"" + (custom_class || 'fluid picker') + "\">\n<select class=\"icons\" :class=\"{ active: " + pojo + "." + fd.$ + ", disabled: " + pojo + ".disable_ }\"\n    v-disable=\"" + pojo + ".disable_\" v-sval:" + fd.t + "=\"" + pojo + "." + fd.$ + "\"\n    @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", false, null, " + pojo + "$$)\">\n  <option value=\"\">" + display + ":</option>\n  <option value=\"1\">" + fd.$n + " &#xe9fc;</option>\n  <option value=\"0\">" + fd.$n + " &#xea00;</option>\n</select>" + (content || '') + "\n</div>\n"; /**/
}
export function field_suggest(fd, pojo, display, custom_class, content) {
    return "\n<div class=\"" + (custom_class || 'ui input') + "\">\n  <input type=\"text\"\n      placeholder=\"" + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\"\n      v-suggest=\"{ pojo: " + pojo + ", field: '" + fd.$ + "', fetch: qform." + fd.$ + "$$AC }\" />" + (content || '') + "\n</div>\n"; /**/
}
export function field_num(fd, pojo, display, custom_class, content) {
    return "\n<div class=\"" + (custom_class || 'ui input') + "\">\n  <input type=\"text\"" + (fd.o === 2 && dpicker(false, pojo, fd.$ || fd._) || '') + "\n      placeholder=\"" + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\" v-sval:" + fd.t + append(fd.o, ',') + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", false, null, " + pojo + "$$)\" />" + (content || '') + "\n</div>\n"; /**/
}
export function field_num_end(fd, pojo, display, custom_class, content) {
    return "\n<div class=\"" + (custom_class || 'ui input') + "\">\n  <input type=\"text\"" + (fd.o === 2 && dpicker(false, pojo + '$', fd.$ || fd._) || '') + "\n      placeholder=\"End " + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\" v-sval:" + fd.t + append(fd.o, ',') + "=\"" + pojo + "$." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + "$, " + fd._ + ", false, null, " + pojo + "$$, true)\" />" + (content || '') + "\n</div>\n"; /**/
}
export function field_num_range(fd, pojo, display, custom_class) {
    var sval = "" + fd.t + append(fd.o, ','), clazz = custom_class || 'ui input';
    return "\n<div class=\"" + clazz + "\">\n  <input type=\"text\"" + (fd.o === 2 && dpicker(false, pojo, fd.$ || fd._) || '') + "\n      placeholder=\"" + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\" v-sval:" + sval + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", false, null, " + pojo + "$$, true)\" />\n</div>\n<div class=\"" + clazz + "\">\n  <input type=\"text\"" + (fd.o === 2 && dpicker(false, pojo + '$', fd.$ || fd._) || '') + "\n      placeholder=\"End " + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\" v-sval:" + sval + "=\"" + pojo + "$." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + "$, " + fd._ + ", false, null, " + pojo + "$$, true)\" />\n</div>\n"; /**/
}
export function field_default(fd, pojo, display, changeSuffix, custom_class, content) {
    return "\n<div class=\"" + (custom_class || 'ui input') + "\">\n  <input type=\"text\"\n      placeholder=\"" + display + "\" v-sclass:disabled=\"" + pojo + ".disable_\"\n      v-disable=\"" + pojo + ".disable_\" v-sval:" + fd.t + append(fd.o, ',') + "=\"" + pojo + "." + fd.$ + "\"\n      @change=\"" + pojo + ".$d.$change($event, " + pojo + ", " + fd._ + ", false, null, " + pojo + "$$" + changeSuffix + ")\" />" + (content || '') + "\n</div>\n"; /**/
}
export function filter_fields(it, jso, fields, pojo, nf) {
    var buf = '', descriptor = it.qd.$d, fd, fk, disable, display, suggestKind;
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
            buf += field_suggest(fd, pojo, display);
        }
        else if (fd.t === 1 /* BOOL */) {
            buf += field_bool(fd, pojo, display);
        }
        else if (fd.t === 16 /* ENUM */) {
            buf += field_enum(fd, pojo, display);
        }
        else if (fd.t !== 3 /* STRING */) {
            // check range
            buf += (jso['e' + fk] ? field_num_range(fd, pojo, display) : field_num(fd, pojo, display));
        }
        else if (jso['p' + fk]) {
            buf += field_default(fd, pojo, display, ", " + 1 /* SKIP_VALIDATE */);
        }
        else {
            buf += field_default(fd, pojo, display, '');
            // TODO range for string?
            if (jso['e' + fk]) {
            }
        }
    }
    buf += '</div>';
    return buf;
}
export function items(it, values) {
    var buf = '', qd = it.qd, key_array = qd.key_array, jso;
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
    return "\n<div class=\"fluid picker\">\n  <select v-disable=\"" + pager + ".state & " + 264 /* MASK_RPC_DISABLE */ + "\" @change=\"qform.change($event)\">\n  " + option_empty + "\n  " + enum_options(values, displayValues) + "\n  </select>\n</div>\n<form class=\"ui form\" onsubmit=\"return false;\">\n  " + items(it, values) + "\n</form>\n"; /**/
}
//# sourceMappingURL=qform.js.map