import { parseOpts } from '../_sval'

export function bind() {
    this.opts = parseOpts(this.arg.split('__'), this.el)
}

export function update(value: any, oldValue: any) {
    this.opts.fn(this.el, value)
}

export function unbind() {}