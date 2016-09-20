import { Opts, parseOpts, cleanup } from '../_dpicker'

export function update(value: any, oldValue: any) {
    if (oldValue) return

    if (value && value.pojo && value.field)
        this.calendar = parseOpts(this.arg && this.arg.split(','), value.pojo, value.field, this.el)
    else
        console.warn('Must provide value: { pojo: obj, field: string }')
}

export function unbind() {
    let calendar = this.calendar
    if (calendar)
        cleanup(calendar)
}