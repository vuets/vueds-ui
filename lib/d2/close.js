import { defp } from 'vueds';
import { parseOpts, cleanup } from '../_close';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-close.');
        return;
    }
    defp(el, 'close_', parseOpts(dir.arg.split(','), dir.value, el));
}
export function unbind(el, dir, vnode) {
    var opts = el.close_;
    if (opts)
        cleanup(opts);
}
//# sourceMappingURL=close.js.map