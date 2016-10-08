export interface CommonOpts {
    pojo: string
}

export function timeago(it: CommonOpts): string {
    let pojo = it.pojo
    return `
<i class="icon clock"></i>{{ ${pojo}.ts | prettydate }}
<i class="icon pencil" v-show="${pojo}.rev" :title="${pojo}.rev"></i><span v-show="${pojo}.rev">{{ ${pojo}.updateTs | prettydate }}</span>`
}

export interface ToggleOpts extends CommonOpts {
    field: string
    fn: string
    bit: number
    icon_class?: string
    title_expr?: string
}

export function toggle(it: ToggleOpts): string {
    let pojo = it.pojo,
        bit = it.bit,
        title_expr = !it.title_expr ? '' : (` :title="${it.title_expr}"`)
    return `
<i class="icon ${it.icon_class || 'circle'}" v-sclass:empty="!${pojo}.${it.field}" @click="(${pojo}._.state |= ${bit})"${title_expr}></i>
<i class="icon ok-circled" v-show="(${pojo}._.state & ${bit})" @click="${it.fn}(${pojo}, ${pojo}._.state ^= ${bit})"></i>
<i class="icon cancel-circled" v-show="(${pojo}._.state & ${bit})" @click="(${pojo}._.state ^= ${bit})"></i>`
}

export interface DrawerOpts extends CommonOpts {
    bit: number
    form?: string
    fn?: string
    tabindex?: number
}

export function drawer(it: DrawerOpts, content?: string): string {
    let pojo = it.pojo,
        bit = it.bit,
        and_call = '',
        tabindex = it.tabindex === undefined ? '' : ' tabindex="0"',
        append = !it.form ? '' : ` v-append:${it.form}="(${pojo}._.state & ${bit})"`
    
    if (it.fn) {
        and_call = ` && ${it.fn}()`
    } else if (it.form) {
        and_call = ` && ${it.form}$$A()`
    }

    return `
<div class="content" @click="(${bit} === (${pojo}._.state ^= ${bit}))${and_call}">
  <i ${tabindex}class="icon" v-pclass:angle-="(${pojo}._.state & ${bit}) ? 'down' : 'right'"></i>${content || ''}
</div>
<dd v-show="(${pojo}._.state & ${bit})"${append}></dd>`
}
