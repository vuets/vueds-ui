import { PojoState, PojoListState } from 'vueds/lib/types'
import { attrs, exprs, or, append, prepend } from '../common'

export interface ItemOpts {
    item_class?: string
    item_attrs?: any
    item_show_expr?: string
    item_class_exprs?: any
    
    pojo?: string
}

export interface ListOpts {
    pager: string
    attrs?: any
    custom_list_class?: string
    list_class?: string
}

export interface Opts extends ItemOpts, ListOpts {
    raw?: boolean
}

const DEFAULT_LIST_CLASS = 'small divided selection'

function list_class(it: ListOpts): string {
    return `${prepend(it.list_class)}${DEFAULT_LIST_CLASS}`
}

function item_class_exprs(it: ItemOpts): string {
    return `:class="{ active: (${it.pojo}._.lstate & ${PojoListState.SELECTED})${exprs(it.item_class_exprs)} }"`
}

function item_class_expr(it: ItemOpts): string {
    return `v-sclass:active="(${it.pojo}._.lstate & ${PojoListState.SELECTED})"`
}

export function item(it: ItemOpts, content: string, initialAttrs?: string) {
    let pojo = it.pojo
    return /**/`
<li${append(initialAttrs)} v-defp:pager_item="${pojo}" class="item${append(it.item_class)}"${attrs(it.item_attrs)}
    v-show="(${pojo}._.lstate & ${PojoListState.INCLUDED})${append(it.item_show_expr, ' && ')}"
    ${it.item_class_exprs && item_class_exprs(it) || item_class_expr(it)}>
  ${content}
  <div v-show="${pojo}._.msg">
    <div class="ui message" v-pclass:status-="(${pojo}._.state & ${PojoState.MASK_STATUS})">
      <i class="close icon" @click.prevent="${pojo}._.msg = null"></i>
      <span v-text="${pojo}._.msg"></span>
    </div>
  </div>
</li>
`/**/
}

export function new_pi(it: ItemOpts) {
    if (!it.pojo)
        it.pojo = 'pojo'
    
    return {
        name: 'pi',
        props: {
            pojo: { type: Object, required: true }
        },
        template: item(it, '<slot></slot>')
    }
}

export function pi(it: ListOpts, content: string, pojo?: string) {
    if (!pojo)
        pojo = 'pojo'
    
    return /**/`
<ul class="ui ${or(it.custom_list_class, list_class, it)} list"${attrs(it.attrs)}>
  <pi v-for="${pojo} in ${it.pager}.array" :${pojo}="${pojo}">
    ${content}
  </pi>
</ul>
`/**/
}

export function main(it: Opts, content: string): string {
    if (!it.raw)
        return pi(it, content, it.pojo)
    
    if (!it.pojo)
        it.pojo = 'pojo'
    
    return /**/`
<ul class="ui ${or(it.custom_list_class, list_class, it)} list"${attrs(it.attrs)}>
  ${item(it, content, `v-for="${it.pojo} in ${it.pager}.array"`)}
</ul>
`/**/
}
