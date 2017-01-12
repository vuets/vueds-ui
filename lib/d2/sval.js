import { parseOpts } from '../_sval';
import { defp } from 'vueds/lib/util';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-sval.');
    }
}
export function inserted(el, dir, vnode) {
    if (!dir.arg)
        return;
    var opts = parseOpts(dir.arg.split(','), el);
    defp(el, 'sval_', opts);
    opts.fn(el, dir.value);
}
export function update(el, dir, vnode) {
    var value = dir.value;
    if (value === undefined || value === dir.oldValue)
        return;
    var opts = el.sval_;
    if (opts)
        opts.fn(el, value);
}
//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {} 
//# sourceMappingURL=sval.js.map