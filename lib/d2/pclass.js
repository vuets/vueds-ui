import { addClass, removeClass } from '../dom_util';
function onUpdate(el, arg, value, oldValue) {
    if (oldValue)
        removeClass(el, arg + oldValue);
    if (value)
        addClass(el, arg + value);
}
export function bind(el, dir, vnode) {
    onUpdate(el, dir.arg, dir.value, dir.oldValue);
}
export function update(el, dir, vnode) {
    onUpdate(el, dir.arg, dir.value, dir.oldValue);
}
//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {} 
//# sourceMappingURL=pclass.js.map