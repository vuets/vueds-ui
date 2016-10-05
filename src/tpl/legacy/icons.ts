export interface ToggleOpts {
    pojo: string
    fn: string
    bit?: number
    icon_class?: string 
}

export function toggle(it: ToggleOpts): string {
    let pojo = it.pojo,
        bit = it.bit || 1
    return `
<i class="icon ${it.icon_class || 'circle'}" v-sclass:empty="!${pojo}.active" title="Active" @click="${pojo}._.vstate |= ${bit}"></i>
<i class="icon ok-circled" v-show="(${pojo}._.vstate & ${bit})" @click="${it.fn}(${pojo}, ${pojo}._.vstate ^= ${bit})"></i>
<i class="icon cancel-circled" v-show="(${pojo}._.vstate & ${bit})" @click="${pojo}._.vstate ^= ${bit}"></i>`
}