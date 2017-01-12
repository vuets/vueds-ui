import { when, when_fn, append, prepend, include_if, quote, attr } from '../common'
import { PojoState, FieldType, PagerState } from 'vueds/lib/types'
import * as $close from '../../_close'
import * as $dpicker from '../../_dpicker'

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
    show_expr?: string

    without_fields?: boolean
    without_msg?: boolean
    without_vclass?: boolean

    //_content?: string
    ffid?: string // first field id
    id?: string
}

export const option_empty = '<option value=""></option>'

export function enum_options(arrayValue: any[], arrayDisplay: any[]): string {
    let out = '',
        len = arrayValue.length,
        i = 0
    
    for (; i < len; i++)
        out += `<option value="${arrayValue[i]}">${arrayDisplay[i]}</option>`
    
    return out
}

function field_enum(it: Opts, fd: any, pojo: string, ffid: any): string {
    return `
<div class="fluid picker">
  <select${include_if(ffid, ffid_attr, ffid)} v-sval:${fd.t}="${pojo}.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, ${!!it.update}${append(pojo !== it.pojo && it.pojo, ', ')})">
    ${when(!it.update, option_empty)}${enum_options(fd.v_fn(), fd.$v_fn())}
  </select>
</div>`
}

function field_bool(it: Opts, fd: any, pojo: string, ffid: any): string {
    return `
<div class="ui checkbox">
  <input${include_if(ffid, ffid_attr, ffid)} type="checkbox"
      v-sval:${fd.t}="${pojo}.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, ${!!it.update}${append(pojo !== it.pojo && it.pojo, ', ')})" />
</div>`
}

function field_textarea(it: Opts, fd: any, pojo: string, ffid: any): string {
    return `
<div class="ui input">
  <textarea${include_if(ffid, ffid_attr, ffid)} v-sval:${fd.t}="${pojo}.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, ${!!it.update}${append(pojo !== it.pojo && it.pojo, ', ')})"></textarea>
  ${include_if(fd.$h, help_text, fd)}
  <div v-text="!(${pojo}._.vfbs & ${1 << (fd._ - 1)}) ? '' : ${pojo}._['${fd._}']"></div>
</div>`
}

export function dpicker(update: boolean, pojo: string, field: string): string {
    return ` v-dpicker:${$dpicker.Flags.TRIGGER_CHANGE_ON_SELECT | (update ? $dpicker.Flags.UPDATE : 0)}="{ pojo: ${pojo}, field: '${field}' }"`
}

function field_num(it: Opts, fd: any, pojo: string, ffid: any): string {
    return `
<div class="ui input">
  <input${include_if(ffid, ffid_attr, ffid)} type="text"${fd.o === 2 && dpicker(!!it.update, pojo, fd.$ || fd._) || ''}
      v-sval:${fd.t}${append(fd.o, ',')}="${pojo}.${fd.$}" @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, ${!!it.update}${append(pojo !== it.pojo && it.pojo, ', ')})" />
  ${include_if(fd.$h, help_text, fd)}
  <div v-text="!(${pojo}._.vfbs & ${1 << (fd._ - 1)}) ? '' : ${pojo}._['${fd._}']"></div>
</div>`
}

function field_default(it: Opts, fd: any, pojo: string, ffid: any): string {
    return `
<div class="ui input">
  <input${include_if(ffid, ffid_attr, ffid)} type="${fd.pw ? 'password' : 'text'}"
      v-sval:${fd.t}="${pojo}.${fd.$}" @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, ${!!it.update}${append(pojo !== it.pojo && it.pojo, ', ')})" />
  ${include_if(fd.$h, help_text, fd)}
  <div v-text="!(${pojo}._.vfbs & ${1 << (fd._ - 1)}) ? '' : ${pojo}._['${fd._}']"></div>
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
    if (t === FieldType.BOOL)
        return field_bool(it, fd, pojo, ffid)
    
    if (t === FieldType.ENUM)
        return field_enum(it, fd, pojo, ffid)
    
    if (t !== FieldType.STRING)
        return field_num(it, fd, pojo, ffid)

    if (fd.ta)
        return field_textarea(it, fd, pojo, ffid)
    
    return field_default(it, fd, pojo, ffid)
}

function show_field(it: Opts, expr: string): string {
    return ` v-show="${expr}"`
}

function error_class(it: Opts, fd: any, pojo: string): string {
    return ` v-sclass:error="(${pojo}._.vfbs & ${1 << (fd._ - 1)}) && ${pojo}._['${fd._}']"`
}

function with_error(ft: number): boolean {
    return ft !== FieldType.BOOL && ft !== FieldType.ENUM
}

function body(it: Opts, descriptor: any, pojo: string, root: any): string {
    let out = '',
        array = descriptor.$fdf
    
    if (descriptor.$fmf) {
        for (let fk of descriptor.$fmf) {
            let fd = descriptor[fk]
            out += body(it, fd.d_fn(), pojo+'.'+fd.$, root)
        }
    }
    
    if (!array)
        return out

    let mask = it.update ? 13 : 3, 
        exclude_fn = it.exclude_fn,
        show_fn = it.show_fn,
        ffid = root.ffid
    
    if (ffid && array.length)
        root.ffid = null

    for (var i = 0, len = array.length; i < len; i++) {
        let fk = array[i],
            fd = descriptor[fk],
            f = fd._
        if (!fd.t || (fd.a & mask) || (exclude_fn && exclude_fn(f, descriptor))) continue

        out += `
<div class="field${when(fd.m === 2, ' required')}"${with_error(fd.t) && error_class(it, fd, pojo) || ''}${show_fn ? when_fn(show_fn, f, descriptor, show_field, it) : ''}>
  <label>${fd.$n}${when(fd.m === 2, ' *')}</label>
  ${field_switch(it, fd, i, pojo, ffid)}
</div>
        `
        ffid = null
    }

    return out
}

/** Alias to body. */
export function fields(it: Opts): string {
    return body(it, it.$d, it.pojo, it)
}

function msg_show_update(pojo: string): string {
    return ` && (${pojo}._.state & ${PojoState.MASK_STATUS})`
}

// TODO v-show="${pojo}._.msg{{? it.update}} && (${pojo}._.state & {{c.MASK_STATUS}}){{?}}"
export function msg(pojo: string, update?: boolean): string {
    return `
<div class="ui message"
    v-show="${pojo}._.msg${include_if(update, msg_show_update, pojo)}"
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
    return `<i class="icon close" v-close:click,${$close.Flags.SELECT_FROM_PARENT}="${quote(it.close_el)}"></i>`
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
    let pojo = it.pojo,
        tag = it.tag || 'form',
        disable = it.pager || it.disable_expr,
        btn_text = it.btn_text || (it.update ? 'Update' : 'Submit')
    
    return `
${
    it.toggle_el && toggle_el(it) || 
    it.hr_before && '<hr />' || 
    it.close_el && close_el(it) || ''
}
<${tag} class="ui form"${attr(it, 'id')}${attr(it, 'show_expr', 'v-show')}
    v-clear v-pclass:status-="(${pojo}._.state & ${PojoState.MASK_STATUS})">
  ${include_if(it.title, title, it)}
  ${when(it.content_slot === ContentSlot.TOP, content)}
  ${!it.without_fields && body(it, it.$d, pojo, it) || ''}
  ${when(it.content_slot === ContentSlot.BEFORE_BUTTON, content)}
  ${!it.without_msg && msg(it.pojo, it.update) || ''}
  <button type="submit" class="ui fluid submit button${append(it.btn_class)}"
      ${disable && (it.pager && disable_pager(it) || it.disable_expr && disable_expr(it)) || ''}
      @click.prevent="${it.on_submit}">
    ${btn_text}
  </button>
</${tag}>
${when(it.hr_after, '<hr />')}
`
}
