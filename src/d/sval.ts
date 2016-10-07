import { Opts, parseOpts } from '../_sval'

export function bind() {
    if (!this.arg) {
        console.warn('arg is required for v-sval.')
        return
    }

    this.opts = parseOpts(this.arg.split(','), this.el)
}

export function update(value: any, oldValue: any) {
    let opts: Opts = this.opts
    if (opts)
        opts.fn(this.el, value)
}

//export function unbind() {}