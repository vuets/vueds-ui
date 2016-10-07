import { addClass, removeClass, resolveElement } from '../dom_util';
export function bind() {
    if (!this.arg)
        this.target = this.el;
}
export function update(value, oldValue) {
    var disabled = !!value, el = this.target;
    if (!el)
        this.target = el = resolveElement(this.el, this.arg, this.vm);
    // check the state before applying
    if (disabled === el.disabled)
        return;
    el.disabled = disabled;
    if (disabled)
        addClass(el, 'disabled');
    else
        removeClass(el, 'disabled');
}
//# sourceMappingURL=disable.js.map