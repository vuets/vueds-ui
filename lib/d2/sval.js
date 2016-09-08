import { parseOpts } from '../_sval';
import { defp } from 'vueds';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-sval.');
        return;
    }
    var opts = parseOpts(dir.arg.split(','), el);
    defp(el, 'sval_opts', opts);
    opts.fn(el, dir.value);
}
export function update(el, dir, vnode) {
    if (dir.value === dir.oldValue) {
        //console.warn('sval: vue2 update propagation bug')
        return;
    }
    var opts = el['sval_opts'];
    if (opts)
        opts.fn(el, dir.value);
}
//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {} 
//# sourceMappingURL=sval.js.map