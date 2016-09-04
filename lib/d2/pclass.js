import { addClass, removeClass } from '../dom_util';
export function bind(el, dir, vnode) { }
export function update(el, dir, vnode) {
    var prefix = dir.arg || '', value = dir.value, oldValue = dir.oldValue;
    if (oldValue) {
        removeClass(el, prefix + oldValue);
    }
    if (value) {
        addClass(el, prefix + value);
    }
}
//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {} 
//# sourceMappingURL=pclass.js.map