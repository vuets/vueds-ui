export function timeago(it) {
    var pojo = it.pojo;
    return "\n<i class=\"icon clock\"></i>{{ " + pojo + ".ts | prettydate }}\n<i class=\"icon pencil\" v-show=\"" + pojo + ".rev\" :title=\"" + pojo + ".rev\"></i><span v-show=\"" + pojo + ".rev\">{{ " + pojo + ".updateTs | prettydate }}</span>";
}
export function toggle(it) {
    var pojo = it.pojo, bit = it.bit, title_expr = !it.title_expr ? '' : (" :title=\"" + it.title_expr + "\"");
    return "\n<i class=\"icon " + (it.icon_class || 'circle') + "\" v-sclass:empty=\"!" + pojo + "." + it.field + "\" @click=\"" + pojo + "._.vstate |= " + bit + "\"" + title_expr + "></i>\n<i class=\"icon ok-circled\" v-show=\"(" + pojo + "._.vstate & " + bit + ")\" @click=\"" + it.fn + "(" + pojo + ", " + pojo + "._.vstate ^= " + bit + ")\"></i>\n<i class=\"icon cancel-circled\" v-show=\"(" + pojo + "._.vstate & " + bit + ")\" @click=\"" + pojo + "._.vstate ^= " + bit + "\"></i>";
}
//# sourceMappingURL=icons.js.map