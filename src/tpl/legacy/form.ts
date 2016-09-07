import { when, attrs, exprs, or, append, prepend, include_if, anchor, quote } from '../common'
import { PojoState } from 'vueds'
import { PagerState } from 'vueds/lib/store'
import { Flags } from '../../_close'

export const enum ContentSlot {
    TOP = 0,
    BEFORE_BUTTON = 1
}

export interface Opts {
    pojo: string
    on_submit: string
    update?: boolean
    pager?: string
    btn_text?: string

    content_slot?: ContentSlot
    tag?: string // form
    title?: string
    toggle_el?: string
    hr_before?: boolean
    close_el?: string
    hr_after?: boolean
    btn_class?: string
    disable_expr?: string

    without_fields?: boolean
    without_msg?: boolean

    _content?: string
}

export function fields(it: Opts): string {
    return `
<div>
  TODO
</div>`
}

function msg_show_update(it: Opts): string {
    return ` && (${it.pojo}._.state & ${PojoState.MASK_STATUS})`
}

// TODO v-show="${pojo}._.msg{{? it.update}} && (${pojo}._.state & {{c.MASK_STATUS}}){{?}}"
export function msg(it: Opts): string {
    let pojo = it.pojo

    return `
<div class="ui message"
    v-show="${pojo}._.msg${include_if(it.update, msg_show_update, it)}"
    v-pclass:status-="(${pojo}._.state & ${PojoState.MASK_STATUS})">
  <i class="icon close" @click.prevent="${pojo}._.msg = null"></i>
  <span v-text="${pojo}._.msg"></span>
</div>`
}

export function toggle_el(it: Opts): string {
    return `
<hr/>
<i class="icon resize-full" v-itoggle:click,1,resize-small,resize-full="[ [${quote(it.toggle_el)}] ]"></i>`
}

function close_el(it: Opts): string {
    return `<i class="icon close" v-close:click,${Flags.SELECT_FROM_PARENT}="${quote(it.close_el)}"></i>`
}

export function title(it: Opts): string {
    return `<p class="title">${it.title}</p>`
}

export function disable_pager(it: Opts): string {
    return `v-disable="${prepend(it.disable_expr, ' || ')}(${it.pager}.state & ${PagerState.LOADING})"`
}

export function disable_expr(it: Opts): string {
    return `v-disable="${it.disable_expr}"`
}

// TODO v-xon="keyup{{? it.modal }}__{{pojo}}._.msg{{?}}:{{pojo}}._.msg = null | key esc"
export function main(it: Opts, content?: string): string {
    it._content = typeof content === 'string' ? content : anchor
    if (!it.pojo)
        it.pojo = 'pojo'

    let pojo = it.pojo,
        tag = it.tag || 'form',
        disable = it.pager || it.disable_expr,
        btn_text = it.btn_text || 'Submit'
    
    return `
${
    it.toggle_el && toggle_el(it) || 
    it.hr_before && '<hr />' || 
    it.close_el && close_el(it) || ''
}
<${tag} class="ui form"
    v-clear v-pclass:status-="(${pojo}._.state & ${PojoState.MASK_STATUS})">
  ${include_if(it.title, title, it)}
  ${when(it.content_slot === ContentSlot.TOP, it._content)}
  ${include_if(!it.without_fields, fields, it)}
  ${when(it.content_slot === ContentSlot.BEFORE_BUTTON, it._content)}
  ${include_if(!it.without_msg, msg, it)}
  <button type="submit" class="ui fluid submit button${append(it.btn_class)}"
      ${disable && (it.pager && disable_pager(it) || it.disable_expr && disable_expr(it)) || ''}
      @click.prevent="${it.on_submit}">
    ${btn_text}
  </button>
</${tag}>
${when(it.hr_after, '<hr />')}
`
}