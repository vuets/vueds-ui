export interface Entry {
    display: string;
    value: number;
    checked: boolean;
}
export interface Container {
    [key: string]: Entry;
}
export declare function putCheckboxBitset(container1: Container, container2: Container, bitArray1: Entry[], bitArray2: Entry[], arrayValue: number[], arrayDisplay: string[]): void;
