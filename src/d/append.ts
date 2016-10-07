import { resolveElement } from '../dom_util'

export function bind(this: any) {
    if (!this.arg) {
        console.warn('arg is required for v-append.')
    }
}

export function update(this: any, value: any, oldValue: any) {
    if (!this.arg || !value || value === oldValue) return
    
    var el = this.el,
        el_append = this.el_append
    
    if (!el_append)
        this.el_append = el_append = resolveElement(el, this.arg, this.vm)
    
    el.appendChild(el_append)
}
