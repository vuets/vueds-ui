import { defp } from 'vueds/lib/util';
import { parseOpts, cleanup } from '../_toggle';
export function inserted(el, dir, vnode) {
    defp(el, 'toggle', parseOpts(dir.arg && dir.arg.split(','), dir.value, vnode.context, el));
}
export function unbind(el, dir, vnode) {
    var opts = el.toggle;
    if (opts) {
        cleanup(opts);
        el.toggle = null;
    }
}
//# sourceMappingURL=toggle.js.map