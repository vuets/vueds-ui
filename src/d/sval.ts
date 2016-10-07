import { Opts, parseOpts } from '../_sval'

export function bind(this: any) {
    if (!this.arg) {
        console.warn('arg is required for v-sval.')
        return
    }

    this.opts = parseOpts(this.arg.split(','), this.el)
}

export function update(this: any, value: any, oldValue: any) {
    if (value === undefined)
        return
    
    let opts: Opts = this.opts
    if (opts)
        opts.fn(this.el, value)
}
