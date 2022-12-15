import DatabaseUtil from "../utils/database.util";
import { v4 as uuidV4 } from 'uuid';
import { sha512 } from "js-sha512";
import { IShortened } from "../utils/interfaces/models/bragi/shortened.model";

const possibilities = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export default class BragiService {
    static async shorten(url: string): Promise<string> {
        let key: string;
        let exist: any[];

        do {
            key = this._randomKey();
            exist = await DatabaseUtil.query("SELECT 1 FROM bragi_shortened_urls WHERE code = ?", [sha512(key)]).catch(() => false);
        } while(exist.length != 0);

        let uuid: string;
        exist = []

        do {
            uuid = uuidV4();
            exist = await DatabaseUtil.query("SELECT 1 FROM bragi_shortened_urls WHERE uuid = ?", [uuid]).catch(() => false);
        } while(exist.length != 0 )

        const queryResult = await DatabaseUtil.query("INSERT INTO bragi_shortened_urls (uuid, original, code) VALUES (?, ?, ?)", [uuid, url, sha512(key)]).catch(() => false);
        return key;
    }

    private static _randomKey(): string {
        let key: string = "";

        for(let i = 0; i < 8; i++) key += possibilities[this._random(possibilities.length)];

        return key;
    }

    private static _random(max: number): number{
        return Math.floor(Math.random()*max);
    }

    static async get(options: any): Promise<null | IShortened> {
        let data: null | IShortened = null;

        const queryResult = await DatabaseUtil.query("SELECT * FROM bragi_shortened_urls WHERE code=? LIMIT 1", [sha512(options.code)]).catch(() => data);
        if(!queryResult) return data;
        const res = queryResult[0];
        if(!res) return data;

        data = {
            uuid: res["uuid"],
            original: res["original"],
            code: options.code,
            usages: res["usages"],
            timeout: res["timeout"],
            type: res["type"]
        };

        const updQueryResult = await DatabaseUtil.query("UPDATE bragi_shortened_urls SET usages = ? WHERE uuid = ?", [(data.usages +1).toString(), data.uuid]).catch(() => data);

        return data;
    }
};