import { defp } from 'vueds';
import { parseOpts, cleanup } from '../_lsearch';
export function inserted(el, dir, vnode) {
    var value = dir.value;
    if (value && value.pager && value.fields) {
        defp(el, 'lsearch_', parseOpts(dir.arg && dir.arg.split(','), value.pager, value.fields, value.fn, vnode.context, el));
    }
    else {
        console.warn('v-lsearch requires the value: { pager: Pager, fields: string[], fn? }');
    }
}
export function unbind(el, dir, vnode) {
    var opts = el.lsearch_;
    if (opts) {
        cleanup(opts);
        el.lsearch_ = null;
    }
}
//# sourceMappingURL=lsearch.js.map