import { addClass, removeClass } from '../util';
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
export function unbind(el, dir, vnode) { }
//# sourceMappingURL=pclass.js.map