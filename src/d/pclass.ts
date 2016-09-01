import { addClass, removeClass } from '../dom_util'

export function bind() {
    this.prefix = this.arg || ''
}

export function update(value: any, oldValue: any) {
    if (oldValue) {
        removeClass(this.el, this.prefix + oldValue)
    }
    if (value) {
        addClass(this.el, this.prefix + value)
    }
}

export function unbind() {}