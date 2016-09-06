import { defp } from 'vueds';
import { parseOpts } from '../_itoggle';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-itoggle.');
        return;
    }
    defp(el, 'itoggle', parseOpts(dir.arg.split('__'), dir.value, vnode.context, el));
}
/*export function update(el: any, { value, oldValue }: VNodeDirective, vnode: VNodeWithData) {
    
}*/
export function unbind(el, dir, vnode) {
    var opts = el['itoggle'];
    if (opts)
        el.removeEventListener(opts.type, opts.handler);
}
//# sourceMappingURL=itoggle.js.map