import { Opts, parseOpts, cleanup } from '../_suggest'

export function update(this: any, value: any, oldValue: any) {
    if (oldValue) return

    if (value && value.pojo && value.field && value.fetch)
        this.suggest = parseOpts(this.arg && this.arg.split(','), value.pojo, value.field, value.fetch, this.vm, this.el)
    else
        console.warn('Must provide value: { pojo: obj, field: string, fetch: function }')
}

export function unbind(this: any) {
    let suggest = this.suggest
    if (suggest)
        cleanup(suggest)
}