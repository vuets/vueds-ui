import { Opts, attachOptsTo, cleanup } from '../_pager'

export function update(this: any, value: any, oldValue: any) {
    if (!oldValue && value) {
        attachOptsTo(this.el, this.arg && this.arg.split(','), value, this.vm)
    }
}

export function unbind(this: any) {
    let opts: Opts = this.el.pager_opts
    if (opts) {
        cleanup(opts)
        this.el.pager_opts = null
    }
}