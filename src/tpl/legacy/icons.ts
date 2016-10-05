export interface ToggleOpts {
    pojo: string
    field: string
    fn: string
    bit?: number
    icon_class?: string
    title_expr?: string
}

export function toggle(it: ToggleOpts): string {
    let pojo = it.pojo,
        bit = it.bit || 1,
        title_expr = !it.title_expr ? '' : (` :title="${it.title_expr}"`)
    return `
<i class="icon ${it.icon_class || 'circle'}" v-sclass:empty="!${pojo}.${it.field}" @click="${pojo}._.vstate |= ${bit}"${title_expr}></i>
<i class="icon ok-circled" v-show="(${pojo}._.vstate & ${bit})" @click="${it.fn}(${pojo}, ${pojo}._.vstate ^= ${bit})"></i>
<i class="icon cancel-circled" v-show="(${pojo}._.vstate & ${bit})" @click="${pojo}._.vstate ^= ${bit}"></i>`
}