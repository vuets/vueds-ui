import { attachOptsTo, cleanup } from '../_pager';
export function bind(el, dir, vnode) {
    attachOptsTo(el, dir.arg && dir.arg.split(','), dir.value, vnode.context);
}
export function unbind(el, dir, vnode) {
    var opts = el.pager_opts;
    if (opts) {
        cleanup(opts);
        el.pager_opts = null;
    }
}
//# sourceMappingURL=pager.js.map