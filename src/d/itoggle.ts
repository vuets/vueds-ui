import { Opts, parseOpts, cleanup } from '../_itoggle'

export function bind() {
    if (!this.arg) {
        console.warn('arg is required for v-itoggle.')
    }
}

export function update(value: any, oldValue: any) {
    if (this.arg && !oldValue && value) {
        this.opts = parseOpts(this.arg.split(','), value, this.vm, this.el)
    }
}

export function unbind() {
    let opts: Opts = this.opts
    if (opts)
        cleanup(opts)
}