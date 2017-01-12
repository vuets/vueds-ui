import { defp } from 'vueds/lib/util';
import { parseOpts, cleanup } from '../_close';
export function inserted(el, dir, vnode) {
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