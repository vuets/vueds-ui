export function toggle(it) {
    var pojo = it.pojo, bit = it.bit || 1, title_expr = !it.title_expr ? '' : (" :title=\"" + it.title_expr + "\"");
    return "\n<i class=\"icon " + (it.icon_class || 'circle') + "\" v-sclass:empty=\"!" + pojo + "." + it.field + "\" @click=\"" + pojo + "._.vstate |= " + bit + "\"" + title_expr + "></i>\n<i class=\"icon ok-circled\" v-show=\"(" + pojo + "._.vstate & " + bit + ")\" @click=\"" + it.fn + "(" + pojo + ", " + pojo + "._.vstate ^= " + bit + ")\"></i>\n<i class=\"icon cancel-circled\" v-show=\"(" + pojo + "._.vstate & " + bit + ")\" @click=\"" + pojo + "._.vstate ^= " + bit + "\"></i>";
}
//# sourceMappingURL=icons.js.map