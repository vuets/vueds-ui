import { defp } from 'vueds';
import { parseOpts, cleanup } from '../_itoggle';
export function bind(el, dir, vnode) {
    if (!dir.arg) {
        console.warn('arg is required for v-itoggle.');
        return;
    }
    defp(el, 'itoggle', parseOpts(dir.arg.split(','), dir.value, vnode.context, el));
}
/*export function update(el: any, { value, oldValue }: VNodeDirective, vnode: VNodeWithData) {
    
}*/
export function unbind(el, dir, vnode) {
    var opts = el['itoggle'];
    if (opts)
        cleanup(opts);
}
//# sourceMappingURL=itoggle.js.map