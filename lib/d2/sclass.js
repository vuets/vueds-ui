import { addClass, removeClass } from '../dom_util';
export function inserted(el, dir, vnode) {
    if (dir.value)
        addClass(el, dir.arg);
    else
        removeClass(el, dir.arg);
}
export function update(el, dir, vnode) {
    if (dir.value === dir.oldValue) {
        //console.warn('sclass: vue2 update propagation bug')
        return;
    }
    if (dir.value)
        addClass(el, dir.arg);
    else
        removeClass(el, dir.arg);
}
//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {} 
//# sourceMappingURL=sclass.js.map