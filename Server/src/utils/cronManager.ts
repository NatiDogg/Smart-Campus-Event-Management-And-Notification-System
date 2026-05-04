import cron from "node-cron";
import NotificationService from "../services/notificationService.js";

export const initCronJobs = () => {
  // Runs at 08:30 every day
  // Format: (minute hour day-of-month month day-of-week)
  cron.schedule("30 8 * * *", async () => {
    console.log("[Cron] Starting daily reminder scan...");
    try {
      await NotificationService.processDailyReminders();
      console.log("[Cron] Daily reminder scan completed successfully.");
    } catch (error) {
      console.error("[Cron] Error during reminder scan:", error);
    }
  });

  console.log("✅ Cron Jobs Initialized (Scheduled for 08:30 AM daily)");
}




//"30 8 * * *"