import { addClass, removeClass } from '../dom_util';
export function update(value, oldValue) {
    if (oldValue)
        removeClass(this.el, this.arg + oldValue);
    if (value)
        addClass(this.el, this.arg + value);
}
//# sourceMappingURL=pclass.js.map