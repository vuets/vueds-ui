export interface ToggleOpts {
    pojo: string;
    fn: string;
    bit?: number;
    icon_class?: string;
}
export declare function toggle(it: ToggleOpts): string;
