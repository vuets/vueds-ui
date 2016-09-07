import { when, when_fn, attrs, exprs, or, append, prepend, include_if, anchor, quote } from '../common'
import { PojoState } from 'vueds'
import { PagerState } from 'vueds/lib/store'
import { Flags } from '../../_close'

export const enum ContentSlot {
    TOP = 0,
    BEFORE_BUTTON = 1
}

export interface Opts {
    $d: any // descriptor
    pojo: string
    on_submit: string
    update?: boolean
    pager?: string
    btn_text?: string

    exclude_fn?: (field: number, descriptor) => boolean
    show_fn?: (field: number, descriptor) => string // returns an expression

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
    without_vclass?: boolean

    _content?: string
    ffid?: string // first field id
}

const option_empty = '<option value=""></option>'

function enum_options(fd: any): string {
    let out = '',
        arrayValue = fd.v_fn(),
        arrayDisplay = fd.$v_fn(),
        len = arrayValue.length,
        i = 0
    
    for (i = 0; i < len; i++)
        out += `<option value="${arrayValue[i]}">${arrayDisplay[i]}</option>`
    
    return out
}

function field_enum(it: Opts, fd: any, idx: number, pojo: string, ffid: any): string {
    return `
<div class="fluid picker">
  <select${include_if(ffid, ffid_attr, ffid)} v-sval:${fd.t}="${pojo}.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, ${!!it.update})">
    ${when(!it.update, option_empty)}${enum_options(fd)}
  </select>
</div>`
}

// TODO call the change function?
function field_bool(it: Opts, fd: any, idx: number, pojo: string, ffid: any): string {
    return `
<div class="ui checkbox">
  <input${include_if(ffid, ffid_attr, ffid)} type="checkbox"
      v-sval:${fd.t}="${pojo}.${fd.$}" @change="${pojo}.${fd.$} = $event.target.checked" />
</div>`
}

function field_textarea(it: Opts, fd: any, idx: number, pojo: string, ffid: any): string {
    return `
<div class="ui input">
  <textarea${include_if(ffid, ffid_attr, ffid)} v-sval:${fd.t}="${pojo}.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, ${!!it.update})"></textarea>
  ${include_if(fd.$h, help_text, fd)}
  <div v-text="${pojo}._.vprops.${fd.$}"></div>
</div>`
}

function field_default(it: Opts, fd: any, idx: number, pojo: string, ffid: any): string {
    return `
<div class="ui input">
  <input${include_if(ffid, ffid_attr, ffid)} type="${fd.pw ? 'password' : 'text'}"
      v-sval:${fd.t}="${pojo}.${fd.$}" @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, ${!!it.update})" />
  ${include_if(fd.$h, help_text, fd)}
  <div v-text="${pojo}._.vprops.${fd.$}"></div>
</div>`
}

function help_text(fd): string {
    return `<div class="help-text">${fd.$h}</div>`
}

function ffid_attr(ffid): string {
    return ` id="${ffid}"`
}

function field_switch(it: Opts, fd: any, idx: number, pojo: string, ffid: any): string {
    let t = fd.t
    if (t === 1)
        return field_bool(it, fd, idx, pojo, ffid)
    
    if (t === 16)
        return field_enum(it, fd, idx, pojo, ffid)
    
    if (fd.ta)
        return field_textarea(it, fd, idx, pojo, ffid)
    
    return field_default(it, fd, idx, pojo, ffid)
}

function show_field(it: Opts, expr: string): string {
    return ` v-show="${expr}"`
}

function body(it: Opts, descriptor: any, pojo: string, root: any): string {
    var array = descriptor.$fdf, 
        mask = it.update ? 13 : 3, 
        out = '',
        exclude_fn = it.exclude_fn,
        show_fn = it.show_fn,
        ffid
    
    if (descriptor.$fmf) {
        for (let fk of descriptor.$fmf) {
            let fd = descriptor[fk]
            out += body(it, fd.d_fn(), pojo+'.'+fd.$, root)
        }
    }

    ffid = root.ffid
    if (ffid && array.length)
        root.ffid = null

    for (var i = 0, len = array.length; i < len; i++) {
        let fk = array[i],
            fd = descriptor[fk],
            f = fd._
        if (!fd.t || (fd.a & mask) || (exclude_fn && exclude_fn(f, descriptor))) continue

        out += `
<div${show_fn ? when_fn(show_fn, f, descriptor, show_field, it) : ''} class="field${when(fd.m === 2, ' required')}"
    v-sclass:error="${pojo}._.vprops.${fd.$}">
  <label>${fd.$n}${when(fd.m === 2), ' *'}</label>
  ${field_switch(it, fd, i, pojo, ffid)}
</div>
        `
        ffid = null
    }

    return out
}

export function fields(it: Opts, content?: string): string {
    return `
${typeof content === 'string' ? content : anchor}
${body(it, it.$d, it.pojo, it)}`
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
  ${!it.without_fields && body(it, it.$d, pojo, it) || ''}
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