import { PojoState, PojoListState, SelectionFlags } from 'vueds/lib/store/'
import { when, attrs, exprs, or, append, include_if } from '../common'

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
    return `${when(it.list_class)} small divided selection`
}

function click_to_select(it: Opts): string {
    return `@click="${it.pager}.store.select(${it.pojo}, ${SelectionFlags.CLICKED}, ${it.pojo}.$index)"`
}

export function main(it: Opts, content: string): string {
    if (!it.pojo)
        it.pojo = 'pojo'
    
    let pager = it.pager,
        pojo = it.pojo
    
    return `
<ul class="ui ${or(it.custom_list_class, list_class, it)} list"${attrs(it.attrs)}>
  <li v-for="${pojo} in ${pager}.array" v-defp:pager_item="${it.pojo}" class="item${append(it.item_class)}"${attrs(it.item_attrs)}
      ${include_if(it.click_to_select, click_to_select, it)}
      v-show="(${pojo}._.lstate & ${PojoListState.INCLUDED})${append(it.item_show_expr, ' && ')}"
      :class="{ active: (${pojo}._.lstate & ${PojoListState.SELECTED})${exprs(it.item_class_exprs)} }">
    ${content}
    <div v-show="${pojo}._.msg && !(${pojo}._.vstate & ${PojoState.UPDATE})">
      <div class="ui message" v-pclass:status-="(${pojo}._.state & ${PojoState.MASK_STATUS})">
        <i class="close icon" @click.prevent="${pojo}._.msg = null"></i>
        <span v-text="${pojo}._.msg"></span>
      </div>
    </div>
  </li>
</ul>`
}