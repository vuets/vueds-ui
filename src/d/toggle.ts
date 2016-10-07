import { Opts, parseOpts, cleanup } from '../_toggle'

export function update(this: any, value: any, oldValue: any) {
    if (!oldValue && value) {
        this.opts = parseOpts(this.arg && this.arg.split(','), value, this.vm, this.el)
    }
}

export function unbind(this: any) {
    let opts: Opts = this.opts
    if (opts)
        cleanup(opts)
}