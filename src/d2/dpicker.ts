import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'
import { Opts, parseOpts, cleanup } from '../_dpicker'

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let value = dir.value
    if (value && value.pojo && value.field)
        defp(el, 'dpicker_', parseOpts(dir.arg && dir.arg.split(','), value.pojo, value.field, el))
    else
        console.warn('Must provide value: { pojo: obj, field: string }')
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el.dpicker_
    if (opts) {
        cleanup(opts)
        el.dpicker_ = null
    }
}

