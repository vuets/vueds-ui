import { addClass, removeClass } from '../dom_util';
//export function bind() {}
export function update(value, oldValue) {
    if (value)
        addClass(this.el, this.arg);
    else
        removeClass(this.el, this.arg);
}
//export function unbind() {} 
//# sourceMappingURL=sclass.js.map