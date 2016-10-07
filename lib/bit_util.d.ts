export interface Checkbox {
    display: string;
    value: number;
    checked: boolean;
}
export declare function fillWithCheckbox(arrayValue: number[], arrayDisplay: string[], fill1: Checkbox[], fill2?: Checkbox[]): void;
