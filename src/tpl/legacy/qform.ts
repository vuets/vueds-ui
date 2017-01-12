import { append } from '../common'
import { FieldType, PagerState, ChangeFlags } from 'vueds/lib/types'
import { enum_options, option_empty, dpicker } from './form'

export interface Opts {
    qd: any
    pager?: string
}

export function field_enum(fd: any, pojo: string, display: string, 
        custom_class?: string, content?: string): string {
    return `
<div class="${custom_class || 'fluid picker'}">
  <select v-disable="${pojo}.disable_" v-sval:${fd.t}="${pojo}.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, false, null, ${pojo}$$)">
    <option value="">${display}</option>${enum_options(fd.v_fn(), fd.$v_fn())}
  </select>${content || ''}
</div>`
}

export function field_bool(fd: any, pojo: string, display: string, 
        custom_class?: string, content?: string): string {
    return `
<div class="${custom_class || 'fluid picker'}">
<select class="icons" :class="{ active: ${pojo}.${fd.$}, disabled: ${pojo}.disable_ }"
    v-disable="${pojo}.disable_" v-sval:${fd.t}="${pojo}.${fd.$}"
    @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, false, null, ${pojo}$$)">
  <option value="">${display}:</option>
  <option value="1">${fd.$n} &#xe9fc;</option>
  <option value="0">${fd.$n} &#xea00;</option>
</select>${content || ''}
</div>`
}

export function field_suggest(fd: any, pojo: string, display: string, 
        custom_class?: string, content?: string): string {
    return `
<div class="${custom_class || 'ui input'}">
  <input type="text"
      placeholder="${display}" v-sclass:disabled="${pojo}.disable_"
      v-disable="${pojo}.disable_"
      v-suggest="{ pojo: ${pojo}, field: '${fd.$}', fetch: qform.${fd.$}$$AC }" />${content || ''}
</div>`
}

export function field_num(fd: any, pojo: string, display: string, 
        custom_class?: string, content?: string): string {
    return `
<div class="${custom_class || 'ui input'}">
  <input type="text"${fd.o === 2 && dpicker(false, pojo, fd.$ || fd._) || ''}
      placeholder="${display}" v-sclass:disabled="${pojo}.disable_"
      v-disable="${pojo}.disable_" v-sval:${fd.t}${append(fd.o, ',')}="${pojo}.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, false, null, ${pojo}$$)" />${content || ''}
</div>`
}

export function field_num_end(fd: any, pojo: string, display: string, 
        custom_class?: string, content?: string): string {
    return `
<div class="${custom_class || 'ui input'}">
  <input type="text"${fd.o === 2 && dpicker(false, pojo + '$', fd.$ || fd._) || ''}
      placeholder="End ${display}" v-sclass:disabled="${pojo}.disable_"
      v-disable="${pojo}.disable_" v-sval:${fd.t}${append(fd.o, ',')}="${pojo}$.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}$, ${fd._}, false, null, ${pojo}$$, true)" />${content || ''}
</div>`
}

export function field_num_range(fd: any, pojo: string, display: string, 
        custom_class?: string): string {
    let sval = `${fd.t}${append(fd.o, ',')}`,
        clazz = custom_class || 'ui input'
    return `
<div class="${clazz}">
  <input type="text"${fd.o === 2 && dpicker(false, pojo, fd.$ || fd._) || ''}
      placeholder="${display}" v-sclass:disabled="${pojo}.disable_"
      v-disable="${pojo}.disable_" v-sval:${sval}="${pojo}.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, false, null, ${pojo}$$, true)" />
</div>
<div class="${clazz}">
  <input type="text"${fd.o === 2 && dpicker(false, pojo + '$', fd.$ || fd._) || ''}
      placeholder="End ${display}" v-sclass:disabled="${pojo}.disable_"
      v-disable="${pojo}.disable_" v-sval:${sval}="${pojo}$.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}$, ${fd._}, false, null, ${pojo}$$, true)" />
</div>`
}

export function field_default(fd: any, pojo: string, display: string, changeSuffix: string, 
        custom_class?: string, content?: string): string {
    return `
<div class="${custom_class || 'ui input'}">
  <input type="text"
      placeholder="${display}" v-sclass:disabled="${pojo}.disable_"
      v-disable="${pojo}.disable_" v-sval:${fd.t}${append(fd.o, ',')}="${pojo}.${fd.$}"
      @change="${pojo}.$d.$change($event, ${pojo}, ${fd._}, false, null, ${pojo}$$${changeSuffix})" />${content || ''}
</div>`
}

export function filter_fields(it: Opts, jso: any, fields: number[], pojo: string, nf: string): string {
    let buf = '',
        descriptor = it.qd.$d,
        fd,
        fk,
        disable,
        display,
        suggestKind
    
    buf += `<div class="field" v-show="${pojo}.show__ && ${pojo}.show_">`
    for (let i = 0, len = fields.length; i < len; i++) {
        fk = String(fields[i])
        if (jso['i' + fk])
            continue
        
        fd = descriptor[fk]
        disable = pojo + '.disable_'
        if (jso['r' + fk])
            display = fd.$n + ' *'
        else
            display = fd.$n
        
        suggestKind = jso['s' + fk]
        if (suggestKind) {
            buf += field_suggest(fd, pojo, display)
        } else if (fd.t === FieldType.BOOL) {
            buf += field_bool(fd, pojo, display)
        } else if (fd.t === FieldType.ENUM) {
            buf += field_enum(fd, pojo, display)
        } else if (fd.t !== FieldType.STRING) {
            // check range
            buf += (jso['e' + fk] ? field_num_range(fd, pojo, display) : field_num(fd, pojo, display))
        } else if (jso['p' + fk]) {
            buf += field_default(fd, pojo, display, `, ${ChangeFlags.SKIP_VALIDATE}`)
        } else {
            buf += field_default(fd, pojo, display, '')
            // TODO range for string?
            if (jso['e' + fk]) {

            }
        }
    }

    buf += '</div>'
    return buf
}

export function items(it: Opts, values: any[]): string {
    let buf = '',
        qd = it.qd,
        key_array = qd.key_array,
        jso
    
    for (let i = 0, len = key_array.length; i < len; i++) {
        jso = qd[key_array[i]]
        if (!jso || !jso.fields)
            continue
        buf += filter_fields(it, jso, jso.fields, `qform.${jso.$}`, String(values[i]))
    }
    
    return buf
}

export function main(it: Opts) {
    let pager = it.pager || 'pager',
        qd = it.qd,
        values = qd.value_array,
        displayValues = qd.display_array
    
    return `
<div class="fluid picker">
  <select v-disable="${pager}.state & ${PagerState.MASK_RPC_DISABLE}" @change="qform.change($event)">
  ${option_empty}
  ${enum_options(values, displayValues)}
  </select>
</div>
<form class="ui form" onsubmit="return false;">
  ${items(it, values)}
</form>`
}
