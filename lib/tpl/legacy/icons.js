export function toggle(it) {
    var pojo = it.pojo, bit = it.bit || 1;
    return "\n<i class=\"icon " + (it.icon_class || 'circle') + "\" v-sclass:empty=\"!" + pojo + ".active\" title=\"Active\" @click=\"" + pojo + "._.vstate |= " + bit + "\"></i>\n<i class=\"icon ok-circled\" v-show=\"(" + pojo + "._.vstate & " + bit + ")\" @click=\"" + it.fn + "(" + pojo + ", " + pojo + "._.vstate ^= " + bit + ")\"></i>\n<i class=\"icon cancel-circled\" v-show=\"(" + pojo + "._.vstate & " + bit + ")\" @click=\"" + pojo + "._.vstate ^= " + bit + "\"></i>";
}
//# sourceMappingURL=icons.js.map