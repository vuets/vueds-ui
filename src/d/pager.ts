import { Opts, attachOptsTo, cleanup } from '../_pager'

export function update(value: any, oldValue: any) {
    if (!oldValue && value) {
        attachOptsTo(this.el, this.arg && this.arg.split(','), value, this.vm)
    }
}

export function unbind() {
    let opts = this.el.pager_opts
    if (opts)
        cleanup(opts)
}