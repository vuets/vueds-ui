import { defp } from 'vueds/lib/util';
import { parseOpts, cleanup } from '../_rappendto';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-rappendto.');
    }
}
export function inserted(el, dir, vnode) {
    if (dir.arg)
        defp(el, 'rappendto_', parseOpts(dir.arg.split(','), vnode.context, el));
}
export function unbind(el, dir, vnode) {
    var opts = el.rappendto_;
    if (opts)
        cleanup(opts);
}
//# sourceMappingURL=rappendto.js.map