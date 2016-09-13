import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'
import { Opts, parseOpts, cleanup } from '../_suggest'

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let value = dir.value
    if (dir.arg && value.pojo && value.fetch)
        defp(el, 'suggest_', parseOpts(dir.arg.split(','), value.pojo, value.fetch, vnode.context, el))
    else
        console.warn('Must provide arg: field[,flags] and value: { pojo: obj, fetch: function }')
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el.suggest_
    if (opts) {
        cleanup(opts)
        el.suggest_ = null
    }
}

