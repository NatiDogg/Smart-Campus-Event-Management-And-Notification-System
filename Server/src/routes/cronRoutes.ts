import express from 'express'
import type { Router, Request, Response } from 'express'
import { env } from '../utils/zodEnvFilesValidator.js'
import NotificationService from '../services/notificationService.js'


const cronRouter:Router = express.Router()

cronRouter.post('/daily-reminders', async (req: Request, res: Response) => {
    const secret = req.headers['x-cron-secret'];
    if (secret !== env.CRON_SECRET) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        await NotificationService.processDailyReminders();
        return res.status(200).json({ success: true, message: "Daily reminders sent!" });
    } catch (error) {
        console.error("[Cron] Error during reminder scan:", error);
        return res.status(500).json({ success: false, message: "Cron job failed" });
    }
});


export default cronRouter;