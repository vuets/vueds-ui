import { Opts, parseOpts, cleanup } from '../_rclass'

export function bind() {
    if (!this.arg) {
        console.warn('arg is required for v-rclass.')
        return
    }
    
    this.opts = parseOpts(this.arg.split(','), this.el)
}

export function unbind() {
    let opts: Opts = this.opts
    if (opts)
        cleanup(opts)
}
