import { Opts, parseOpts, cleanup } from '../_close'

export function bind() {
    if (!this.arg) {
        console.warn('arg is required for v-close.')
    }
}

export function update(value: any, oldValue: any) {
    let opts = this.opts
    if (this.arg && !oldValue && value) {
        this.opts = parseOpts(this.arg.split(','), value, this.el)
    }
}

export function unbind() {
    let opts: Opts = this.opts
    if (opts)
        cleanup(opts)
}