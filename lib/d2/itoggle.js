import { defp } from 'vueds';
import { parseOpts, cleanup } from '../_itoggle';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-itoggle.');
    }
}
export function inserted(el, dir, vnode) {
    if (dir.arg)
        defp(el, 'itoggle', parseOpts(dir.arg.split(','), dir.value, vnode.context, el));
}
export function unbind(el, dir, vnode) {
    var opts = el.itoggle;
    if (opts) {
        cleanup(opts);
        el.itoggle = null;
    }
}
//# sourceMappingURL=itoggle.js.map