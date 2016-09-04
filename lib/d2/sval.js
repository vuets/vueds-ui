import { parseOpts } from '../_sval';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-sval.');
        return;
    }
    dir['opts'] = parseOpts(dir.arg.split('__'), el);
}
export function update(el, dir, vnode) {
    var opts = dir['opts'];
    if (opts)
        opts.fn(el, dir.value);
}
export function unbind(el, dir, vnode) { }
//# sourceMappingURL=sval.js.map