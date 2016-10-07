import { Opts, parseOpts, cleanup } from '../_rappendto'

export function bind(this: any) {
    if (!this.arg) {
        console.warn('arg is required for v-rappendto.')
        return
    }
    
    this.opts = parseOpts(this.arg.split(','), this.vm, this.el)
}

export function unbind(this: any) {
    let opts: Opts = this.opts
    if (opts)
        cleanup(opts)
}
