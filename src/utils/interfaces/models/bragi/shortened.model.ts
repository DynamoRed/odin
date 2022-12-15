export interface IShortened {
    uuid: string;
    original: string;
    code: string;
    usages: number;
    timeout: number;
    type: boolean;
}