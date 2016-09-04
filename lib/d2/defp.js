import { defp } from 'vueds';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-defp.');
    }
}
export function update(el, dir, vnode) {
    if (dir.arg && !dir.oldValue && dir.value)
        defp(el, dir.arg, dir.value);
}
export function unbind(el, dir, vnode) { }
//# sourceMappingURL=defp.js.map