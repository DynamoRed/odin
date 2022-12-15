import { Router, Request, Response, NextFunction } from "express";
import ResponsesUtil from "../utils/responses.util";
import ActorsUtil from "../utils/actors.util";
import service from "../services/bragi.service";

const router: Router = Router();

router.get('/:code', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let options = {
        "code": req.params.code,
    };

    try {
        const result = await service.get(options);
        if(!result) ResponsesUtil.notFound(res);
        else res.status(200).json({data: result});
    } catch(err) { return ResponsesUtil.somethingWentWrong(res) }
});

router.post('/shorten', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if(!await ActorsUtil.isAuthorized(req.headers["api-key"])) return ResponsesUtil.unauthorizedAction(res);

    let options = {
        "url": req.body.url,
    };

    if(!options.url || !options.url.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)) return ResponsesUtil.invalidParameters(res);

    try {
        const result = await service.shorten(options.url);
        if(!result) ResponsesUtil.notFound(res);
        else res.status(200).json({data: result});
    } catch(err) { return ResponsesUtil.somethingWentWrong(res) }
});

/***************************************************************
* NOT ALLOWED METHODS HANDLING
***************************************************************/

router.all('/:code', async (req: Request, res: Response, next: NextFunction): Promise<void> => ResponsesUtil.methodNotAllowed(res));
router.all('/shorten', async (req: Request, res: Response, next: NextFunction): Promise<void> => ResponsesUtil.methodNotAllowed(res));

/**************************************************************/

export default router;