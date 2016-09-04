import { FnUpdate } from './dom_util';
export interface Opts {
    type: number;
    flags: number;
    fn: FnUpdate;
}
export declare function parseOpts(args: string[], el: any): Opts;
