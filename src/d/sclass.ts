import { addClass, removeClass } from '../dom_util'

export function update(this: any, value: any, oldValue: any) {
    if (value)
        addClass(this.el, this.arg)
    else
        removeClass(this.el, this.arg)
}
