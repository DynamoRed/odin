import { Express } from "express";
import BragiRouter from "../routes/bragi.route";
import AuthorizationRouter from "../routes/authorization.route";

export default class RouterUtil {
    static baseUrl: String = "/odin";

    static init(app: Express): void {
        app.use(this.baseUrl + '/bragi', BragiRouter);
        app.use(this.baseUrl + '/authorization', AuthorizationRouter);
    }
}