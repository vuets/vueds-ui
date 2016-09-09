import { defp } from 'vueds';
import { parseOpts, cleanup } from '../_close';
export function bind(el, dir, vnode) {
    defp(el, 'close_', parseOpts(dir.arg && dir.arg.split(','), dir.value, el));
}
export function unbind(el, dir, vnode) {
    var opts = el.close_;
    if (opts) {
        cleanup(opts);
        el.close_ = null;
    }
}
//# sourceMappingURL=close.js.map