import { addClass, removeClass } from '../dom_util';
function doUpdate(el, value) {
    var disabled = !!value;
    // check the state before applying
    if (disabled === el.disabled)
        return;
    el.disabled = disabled;
    if (disabled)
        addClass(el, 'disabled');
    else
        removeClass(el, 'disabled');
}
export function inserted(el, dir, vnode) {
    doUpdate(el, dir.value);
}
export function update(el, dir, vnode) {
    if (dir.value === dir.oldValue) {
        //console.warn('disable: vue2 update propagation bug')
        return;
    }
    doUpdate(el, dir.value);
}
//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) { } 
//# sourceMappingURL=disable.js.map