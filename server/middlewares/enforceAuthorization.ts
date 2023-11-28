import { Request, Response, NextFunction} from "express";
import admin from "../config/firebase";

const enforceAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization as string).split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const decodedUID = decodedToken.uid;

    if(decodedUID !== req.params.uid) {
        return res.status(401).json({
            status: "UNAUTHORIZED",
            message: "Unauthorized to access this resource"
        });
    }
    return next();
}

export default enforceAuthorization;
