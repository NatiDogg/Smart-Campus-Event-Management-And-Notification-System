import cron from "node-cron";
import NotificationService from "../services/notificationService.js";

export const initCronJobs = ()=>{
    cron.schedule("0 * * * *", async () => {
        console.log("[Cron] Starting daily reminder scan...");
        try {
            await NotificationService.processDailyReminders();
            console.log("[Cron] Daily reminder scan completed successfully.");
        } catch (error) {
            console.error("[Cron] Error during reminder scan:", error);
        }
    });

    console.log(" Cron Jobs Initialized");
}