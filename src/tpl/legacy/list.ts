import { PojoState } from 'vueds'
import { PojoListState, SelectionFlags } from 'vueds/lib/store/'
import { when, attrs, exprs, or, append, prepend, include_if } from '../common'

export interface Opts {
    pager: string

    custom_list_class?: string
    list_class?: string
    attrs?: any

    click_to_select?: boolean

    item_class?: string
    item_attrs?: any
    item_show_expr?: string
    item_class_exprs?: any
    
    pojo?: string
}

function list_class(it: Opts): string {
    return `${prepend(it.list_class)}small divided selection`
}

function click_to_select(it: Opts): string {
    return `@click="${it.pager}.store.select(${it.pojo}, ${SelectionFlags.CLICKED}, ${it.pojo}.$index)"`
}

function item_class_exprs(it: Opts): string {
    return `:class="{ active: (${it.pojo}._.lstate & ${PojoListState.SELECTED})${exprs(it.item_class_exprs)} }"`
}

function item_class_expr(it: Opts): string {
    return `v-sclass:active="(${it.pojo}._.lstate & ${PojoListState.SELECTED})"`
}

export function item(it: Opts, content: string, initialAttrs?: string) {
    let pojo = it.pojo
    if (initialAttrs === undefined) {
        initialAttrs = `v-for="${pojo} in ${it.pager}.array"`
    }
    return `
<li${append(initialAttrs)} v-defp:pager_item="${pojo}" class="item${append(it.item_class)}"${attrs(it.item_attrs)}
    ${include_if(it.click_to_select, click_to_select, it)}
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
`
}

export function new_pi(it: Opts) {
    if (!it.pojo)
        it.pojo = 'pojo'
    
    return {
        name: 'pi',
        props: {
            pojo: { type: Object, required: true }
        },
        template: item(it, '<slot></slot>', '')
    }
}

export function pi(pager: string, content: string, custom_list_class?: string, ul_attrs?: any) {
    let cls = custom_list_class || 'small divided selection'
    return `
<ul class="ui ${cls} list"${attrs(ul_attrs)}>
  <pi v-for="pojo in ${pager}.array" :pojo="pojo">
    ${content}
  </pi>
</ul>`
}

export function main(it: Opts, content: string): string {
    if (!it.pojo)
        it.pojo = 'pojo'
    
    return `
<ul class="ui ${or(it.custom_list_class, list_class, it)} list"${attrs(it.attrs)}>
  ${item(it, content)}
</ul>`
}
