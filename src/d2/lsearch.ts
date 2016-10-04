import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'
import { Opts, parseOpts, cleanup } from '../_lsearch'

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let value = dir.value

    if (value && value.pager && value.fields) {
        defp(el, 'lsearch_', parseOpts(dir.arg && dir.arg.split(','),
                value.pager, value.fields, value.fn, vnode.context, el))
    } else {
        console.warn('v-lsearch requires the value: { pager: Pager, fields: string[], fn? }')
    }
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el.lsearch_
    if (opts) {
        cleanup(opts)
        el.lsearch_ = null
    }
}