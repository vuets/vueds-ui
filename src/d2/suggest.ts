import { VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'
import { Opts, parseOpts, cleanup } from '../_suggest'

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let value = dir.value
    if (value && value.pojo && value.field && value.fetch)
        defp(el, 'suggest_', parseOpts(dir.arg && dir.arg.split(','), value.pojo, value.field, value.fetch, value.onSelect, vnode.context, el))
    else
        console.warn('Must provide value: { pojo: obj, field: string, fetch: function }')
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el.suggest_
    if (opts) {
        cleanup(opts)
        el.suggest_ = null
    }
}

