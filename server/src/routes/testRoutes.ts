import protect from '../middleware/protect';    
import express, {
    Request,
    Response
} from "express";


const router = express.Router();

router.get(
    "/me",
    protect,
    async (req: Request, res: Response) => {

        res.status(200).json({

            message: "Protected route working",

            user: req.user

        });

    }
);

export default router;