import { addClass, removeClass } from '../util'

export function bind() {}

export function update(value: any, oldValue: any) {
    if (oldValue) {
        removeClass(this.el, this.arg + oldValue)
    }
    if (value) {
        addClass(this.el, this.arg + value)
        oldValue = value
    }
}

export function unbind() {}