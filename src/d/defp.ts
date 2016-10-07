import { defp } from 'vueds'

export function bind(this: any) {
    if (!this.arg) {
        console.warn('arg is required for v-defp.')
    }
}

export function update(this: any, value: any, oldValue: any) {
    if (this.arg && !oldValue && value)
        defp(this.el, this.arg, value)
}
