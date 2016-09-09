import { Opts, parseOpts, cleanup } from '../_close'

export function update(value: any, oldValue: any) {
    if (!oldValue && value) {
        this.opts = parseOpts(this.arg && this.arg.split(','), value, this.el)
    }
}

export function unbind() {
    let opts: Opts = this.opts
    if (opts)
        cleanup(opts)
}