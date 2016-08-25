import { addClass, removeClass } from '../util'

export function bind() {
    this.prefix = this.arg || ''
}

export function update(value: any, oldValue: any) {
    if (oldValue) {
        removeClass(this.el, this.prefix + oldValue)
    }
    if (value) {
        addClass(this.el, this.prefix + value)
        oldValue = value
    }
}

export function unbind() {}