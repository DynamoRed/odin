import { Router, Request, Response, NextFunction } from "express";
import ActorsUtil from "../utils/actors.util";
import ResponsesUtil from "../utils/responses.util";
import { sha512 } from "js-sha512";

const router: Router = Router();

router.get('/:uuid', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let options = {
        "uuid": req.params.uuid,
    };

    if(!options.uuid.match(/^[0-9(a-f|A-F)]{8}-[0-9(a-f|A-F)]{4}-4[0-9(a-f|A-F)]{3}-[89ab][0-9(a-f|A-F)]{3}-[0-9(a-f|A-F)]{12}$/)) return ResponsesUtil.invalidParameters(res);

    try {
        const result = await ActorsUtil.isAuthorized(sha512(options.uuid));
        res.status(200).json({data: result ? "true" : "false"});
    } catch(err) { return ResponsesUtil.somethingWentWrong(res) }
});

/***************************************************************
* NOT ALLOWED METHODS HANDLING
***************************************************************/

router.all('/:uuid', async (req: Request, res: Response, next: NextFunction): Promise<void> => ResponsesUtil.methodNotAllowed(res));

/**************************************************************/

export default router;