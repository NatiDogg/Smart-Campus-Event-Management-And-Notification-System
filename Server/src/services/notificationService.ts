import emailTransporter from "../config/nodeMailer.js";
import AppError from "../utils/appError.js";
import { env } from "../utils/zodEnvFilesValidator.js";
import AdminService from "./adminService.js";
import OrganizerService from "./organizerService.js";
import admin from "../config/fireBase.js";
import UserService from "./userService.js";
import EventService from "./eventService.js";
import RegistrationService from "./registrationService.js";

type adminEmailEventType={
      title: string,
      location: string,
      imageUrl: string

}
type organizerEventType = {
    id: string
     title: string,
     imageUrl: string
}
class NotificationService{
     async sendEmail(to: string, subject: string, html: string){
          try {
            
             const info = await emailTransporter.sendMail({
                from: `"Campus Events" <${env.SENDER_EMAIL}>`,
                to,
                subject,
                html
             })
           
          } catch (error) {
           console.error(`Failed to send email to ${to}:`, error);
          }
     }
     async sendPushNotification(userId: string, title: string, body: string ){
            try {
                 
                const user = await UserService.findUserById(userId)
                if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
                  console.warn(
                    `Push skipped: No tokens found for user ${userId}`
                  );
                  return;
                }
                const message = {
                    notification: {
                        title,
                        body,

                    },
                    tokens: [...user.fcmTokens]
                }
                const response = await admin.messaging().sendEachForMulticast(message);
               
                //clean up logic for invalid tokens
                if (response.failureCount > 0) {
                  const failedTokens: string[] = [];
                  response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                      const error = resp.error?.code;
                      if (
                        error ===
                          "messaging/registration-token-not-registered" ||
                        error === "messaging/invalid-registration-token"
                      ) {
                        failedTokens.push(user.fcmTokens[idx]);
                      }
                    }
                  });
                  if (failedTokens.length > 0) {
                    // Remove the dead tokens from the database
                    await UserService.removeFcmToken(userId, failedTokens);
                    console.log(
                      `Cleaned up ${failedTokens.length} dead tokens for user ${userId}`
                    );
                  }
                }
                 console.log(` Sent push to ${response.successCount} devices for user ${userId}`);

            } catch (error) {
                console.error(" FCM Error:", error);
            }
     }

     async notifyAdminNewEvent(eventDetails: adminEmailEventType ){
        const admins = await AdminService.getAllAdmins();
        if (!admins || admins.length === 0) {
            console.warn("Event created, but no admins exist to notify.");
            return;
        }
        await Promise.all(admins.map(admin=>{
            const html = `
<div style="background-color: #f9fafb; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="padding: 40px 30px 20px 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; color: #111827;">New Event Submission</h1>
            </td>
        </tr>
        
        <tr>
            <td style="padding: 0 30px 20px 30px; line-height: 1.6;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${
                  admin.fullName || "Admin"
                }</strong>,</p>
                <p style="font-size: 15px; margin-bottom: 20px;">
                    A new event, <span style="color: #4f46e5; font-weight: 600;">${
                      eventDetails.title
                    }</span>, 
                    has been submitted for review at <strong>${
                      eventDetails.location
                    }</strong>.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <img src="${
                      eventDetails.imageUrl
                    }" alt="Event Poster" style="width: 100%; max-width: 400px; height: auto; border-radius: 12px; border: 1px solid #d1d5db; display: block; margin: 0 auto;"/>
                </div>
            </td>
        </tr>

        <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
                <a href="YOUR_APP_URL_HERE" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                    Review in App
                </a>
            </td>
        </tr>

        <tr>
            <td style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                <p style="margin: 0;">This is an automated notification from your Event Management System.</p>
            </td>
        </tr>
    </table>
</div>
`;
            return this.sendEmail(admin.email, "New Event Submission", html);
        }))
        
        

     }
     async notifyOrganizerStatus(eventDetails: organizerEventType,status: 'approved' | "rejected"){

         const organizer = await OrganizerService.getOrganizerById(eventDetails.id);
         
         if(!organizer){
             console.warn(`Event ${status}, but organizer was not found.`);
            return;
         }
         const isApproved = status === 'approved';
         const primaryColor = isApproved ? '#22c55e' : '#64748b'; 
    const statusText = isApproved ? 'Approved' : 'Review Required';
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: ${primaryColor}; padding: 24px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 24px;">Event ${statusText}</h2>
        </div>
        
        <div style="padding: 30px; line-height: 1.6; color: #334155;">
            <p style="font-size: 18px;">Hello <b>${
              organizer.fullName || "Organizer"
            }</b>,</p>
            
            <p>We have finished reviewing your event submission:</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid ${primaryColor}; padding: 15px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Event:</strong> ${
                  eventDetails.title
                }</p>
                <p style="margin: 5px 0 0 0;"><strong>Status:</strong> <span style="color: ${primaryColor}; font-weight: bold; text-transform: uppercase;">${status}</span></p>
            </div>

            <div style="text-align: center; margin: 25px 0;">
                <img src="${eventDetails.imageUrl}" alt="${
      eventDetails.title
    }" style="width: 100%; max-width: 400px; height: auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);" />
            </div>

            ${
              isApproved
                ? `<p>Congratulations! Your event is now <b>Live</b> and visible to all students on the platform. You can now track registrations through your dashboard.</p>`
                : `<p>After reviewing your submission, we found that some details need to be adjusted before we can push it live. Please visit the dashboard to see the feedback and update your event.</p>`
            }

            <div style="text-align: center; margin-top: 30px;">
                <a href="" style="background-color: ${primaryColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Go to Dashboard
                </a>
            </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
            <p style="margin: 0;">&copy; 2026 Campus Events Platform. All rights reserved.</p>
        </div>
    </div>
`;
    const subject = isApproved ? `🎉 Approved: ${eventDetails.title}` : `Rejected: ${eventDetails.title}`;
         return this.sendEmail(organizer.email,subject,html);
     }
     async notifyStudentDeadline(userId: string, eventTitle: string){
            const title = "Event Tomorrow! ⏰";
            const body = `Don't forget! "${eventTitle}" starts in 24 hours. See you there!`;
            await this.sendPushNotification(userId, title, body);
     }
     async processDailyReminders(){
        const now = new Date();
        const tomorrowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const tomorrowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

        const registrations = await RegistrationService.getRegistrationDetailForReminder(tomorrowStart, tomorrowEnd);

        for(const reg of registrations){
           if (reg.eventId && reg.studentId) {
             const studentId = reg.studentId._id.toString();
             const eventTitle = reg.eventId.title;

             
             await this.notifyStudentDeadline(studentId, eventTitle);
           }
        }  
        console.log(`[Cron] Processed ${registrations.length} reminders.`);




       

        
     }
     
}

export default new NotificationService();