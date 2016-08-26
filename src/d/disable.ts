import { addClass, removeClass, resolveElement } from '../util'

export function bind() {
    if (!this.arg)
        this.target = this.el
}

export function update(value: any, oldValue: any) {
    let disabled = !!value,
        el = this.target

    if (!el) this.target = el = resolveElement(this.el, this.arg, this.vm)

    el.disabled = disabled
    if (disabled) addClass(el, 'disabled')
    else removeClass(el, 'disabled')
}

export function unbind() {}
