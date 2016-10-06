
export interface Entry {
    display: string
    value: number
    checked: boolean
}

export interface Container {
    [propName: string]: Entry|any
}

export function putCheckboxBitset(container1: Container, container2: Container,
        bitArray1: Entry[], bitArray2: Entry[], 
        arrayValue: number[], arrayDisplay: string[]) {
    var display: string,
        value: number,
        strIdx: string,
        entry: Entry
    
    for (var i = 0, len = arrayValue.length; i < len; i++) {
        display = arrayDisplay[i]
        value = arrayValue[i]
        strIdx = '$' + value

        // 1
        entry = {
            display,
            value,
            checked: false
        }
        bitArray1.push(entry)
        container1[strIdx] = entry

        // 2
        entry = {
            display,
            value,
            checked: false
        }
        bitArray2.push(entry)
        container2[strIdx] = entry
    }
}