import { Opts, parseOpts, cleanup } from '../_dpicker'

export function update(this: any, value: any, oldValue: any) {
    if (oldValue) return

    if (value && value.pojo && value.field)
        this.dpicker = parseOpts(this.arg && this.arg.split(','), value.pojo, value.field, this.el)
    else
        console.warn('v-dpicker requires the value: { pojo: obj, field: string }')
}

export function unbind(this: any) {
    let dpicker = this.dpicker
    if (dpicker)
        cleanup(dpicker)
}