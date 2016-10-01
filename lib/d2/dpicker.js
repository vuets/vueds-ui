import { defp } from 'vueds';
import { parseOpts, cleanup } from '../_dpicker';
export function inserted(el, dir, vnode) {
    var value = dir.value;
    if (value && value.pojo && value.field)
        defp(el, 'dpicker_', parseOpts(dir.arg && dir.arg.split(','), value.pojo, value.field, el));
    else
        console.warn('v-dpicker requires the value: { pojo: obj, field: string }');
}
export function unbind(el, dir, vnode) {
    var opts = el.dpicker_;
    if (opts) {
        cleanup(opts);
        el.dpicker_ = null;
    }
}
//# sourceMappingURL=dpicker.js.map