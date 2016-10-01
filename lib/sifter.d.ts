export interface Opts {
    fields: string[];
    diacritics?: boolean;
    and?: boolean;
}
export default function search(q: string, opts: Opts, array: any[]): any[];
