import logger from "@common/logger";
import { StatusCode } from "@config/status-code";
import { NextFunction, Request, Response } from "express";

export class ModMidleware {
    static async checkDuplicateSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ message: error.message });
        }
    }
}