import { attr } from '../common'
import { FieldType, PojoState, ChangeFlags } from 'vueds/lib/types'

export interface BaseOpts {
    pojo: string
    field: string
    handler: string
    /** Defaults to `(pojo._.state & ${PojoState.LOADING})` */
    disable_expr?: string
    id?: string
    placeholder?: string
}

export interface ChangeOpts extends BaseOpts {
    change_flags?: number
}

export function change(it: ChangeOpts): string {
    let flags = it.change_flags === undefined ? ChangeFlags.CB_ONLY_ON_SET : it.change_flags,
        disable = it.disable_expr || `(${it.pojo}._.state & ${PojoState.LOADING})`
    return `
<input type="text" v-disable="${disable}"${attr(it, 'id')}${attr(it, 'placeholder')}
    v-sval:${FieldType.STRING}="pnew.${it.field}"
    @change="pnew.$d.$change($event, pnew, '${it.field}', false, null, ${it.handler}, ${flags})" />`
}

export interface SuggestOpts extends BaseOpts {
    fetch: string
}

export function suggest(it: SuggestOpts): string {
    let fetch = it.fetch,
        disable = it.disable_expr || `(${it.pojo}._.state & ${PojoState.LOADING})`
    
    if (fetch.charAt(0) === '/')
        fetch = `'${fetch}'`
    
    return `
<input type="text" v-disable="${disable}"${attr(it, 'id')}${attr(it, 'placeholder')}
    v-suggest="{ pojo: ${it.pojo}, field: '${it.field}', fetch: ${fetch}, onSelect: ${it.handler} }" />`
}

