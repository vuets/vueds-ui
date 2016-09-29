import { Opts, parseOpts, cleanup } from '../_lsearch'

export function update(value: any, oldValue: any) {
    if (oldValue) return

    if (value && value.pager && value.fields) {
        this.lsearch = parseOpts(this.arg && this.arg.split(','),
                value.pager, value.fields, value.fn, this.vm, this.el)
    } else {
        console.warn('v-lsearch requires the value: { pager: Pager, fields: string[], fn? }')
    }
}

export function unbind() {
    let lsearch = this.lsearch
    if (lsearch)
        cleanup(lsearch)
}