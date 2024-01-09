import { Request, Response, NextFunction } from "express";


class ErrorHandler extends Error {
    private statusCode: number;
    private status: string;
    constructor(statusCode:number,status:string, message:string) {
        super();
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
    }



}

const handleError = (err: any,req:Request, res: Response,next:NextFunction) => {
    const {status, statusCode, message } = err;
    if (err instanceof ErrorHandler) {
        return res.status(statusCode).json({ status: status, message: message });
    } else if (err instanceof  Error) {
       return res.status(500).json({ status: 'error', message: "Internal Server Error" });
    }else {
        return
    }
};

export {handleError, ErrorHandler};
