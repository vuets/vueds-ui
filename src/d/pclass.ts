import { addClass, removeClass } from '../dom_util'

//export function bind() {}

export function update(value: any, oldValue: any) {
    if (oldValue)
        removeClass(this.el, this.arg + oldValue)
    
    if (value)
        addClass(this.el, this.arg + value)
}

//export function unbind() {}