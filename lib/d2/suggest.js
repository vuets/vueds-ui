import { defp } from 'vueds';
import { parseOpts, cleanup } from '../_suggest';
export function inserted(el, dir, vnode) {
    var value = dir.value;
    if (value && value.pojo && value.field && value.fetch)
        defp(el, 'suggest_', parseOpts(dir.arg && dir.arg.split(','), value.pojo, value.field, value.fetch, vnode.context, el));
    else
        console.warn('Must provide value: { pojo: obj, field: string, fetch: function }');
}
export function unbind(el, dir, vnode) {
    var opts = el.suggest_;
    if (opts) {
        cleanup(opts);
        el.suggest_ = null;
    }
}
//# sourceMappingURL=suggest.js.map