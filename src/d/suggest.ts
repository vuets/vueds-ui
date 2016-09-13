import { Opts, parseOpts, cleanup } from '../_suggest'

export function bind() {

}

export function update(value: any, oldValue: any) {
    if (oldValue) return

    if (this.arg && value && value.pojo && value.fetch)
        this.suggest = parseOpts(this.arg.split(','), value.pojo, value.fetch, this.vm, this.el)
    else
        console.warn('Must provide arg: field[,flags] and value: { pojo: obj, fetch: function }')
}

export function unbind() {
    let suggest = this.suggest
    if (suggest)
        cleanup(suggest)
}