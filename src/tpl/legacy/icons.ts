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
<i class="icon ${it.icon_class || 'circle'}" v-sclass:empty="!${pojo}.${it.field}" @click="${pojo}._.vstate |= ${bit}"${title_expr}></i>
<i class="icon ok-circled" v-show="(${pojo}._.vstate & ${bit})" @click="${it.fn}(${pojo}, ${pojo}._.vstate ^= ${bit})"></i>
<i class="icon cancel-circled" v-show="(${pojo}._.vstate & ${bit})" @click="${pojo}._.vstate ^= ${bit}"></i>`
}
