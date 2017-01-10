
export interface Checkbox {
    display: string
    value: number
    checked: boolean
}

export function fillWithCheckbox(arrayValue: number[], arrayDisplay: string[],
        fill1: Checkbox[], fill2?: Checkbox[]) {
    var display: string,
        value: number
    
    for (var i = 0, len = arrayValue.length; i < len; i++) {
        display = arrayDisplay[i]
        value = arrayValue[i]

        fill1.push({
            display,
            value,
            checked: false
        })

        if (!fill2)
            continue

        // 2
        fill2.push({
            display,
            value,
            checked: false
        })
    }
}