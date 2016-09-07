import { addClass, removeClass } from '../dom_util';
//export function bind() {}
export function update(value, oldValue) {
    if (oldValue)
        removeClass(this.el, this.arg + oldValue);
    if (value)
        addClass(this.el, this.arg + value);
}
//export function unbind() {} 
//# sourceMappingURL=pclass.js.map