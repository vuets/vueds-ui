import { defp } from 'vueds';
import { parseOpts, cleanup } from '../_rclass';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-rclass.');
    }
}
export function inserted(el, dir, vnode) {
    if (dir.arg)
        defp(el, 'rclass_', parseOpts(dir.arg.split(','), el));
}
export function unbind(el, dir, vnode) {
    var opts = el.rclass_;
    if (opts)
        cleanup(opts);
}
//# sourceMappingURL=rclass.js.map