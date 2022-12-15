import { FieldInfo, MysqlError } from "mysql";
import DatabaseUtil from "./database.util";

export default class ActorsUtil {
    static requesters: {[key: string]: number} = {};

    static isAuthorized(key: string | string[] | undefined): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            DatabaseUtil.pool.query("SELECT 1 FROM authorized_actors WHERE token_key = ?", [key], (err: MysqlError | null, rows: any, fields: FieldInfo[] | undefined) => {
                if(err) reject(err.message);
                else resolve(rows[0]);
            });
        });
    }
}