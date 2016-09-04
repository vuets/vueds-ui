import { defp } from 'vueds';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-defp.');
        return;
    }
    defp(el, dir.arg, dir.value);
}
//export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}
//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {} 
//# sourceMappingURL=defp.js.map