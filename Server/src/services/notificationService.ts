import emailTransporter from "../config/nodeMailer.js";
import AppError from "../utils/appError.js";
import { env } from "../utils/zodEnvFilesValidator.js";
import AdminService from "./adminService.js";
import OrganizerService from "./organizerService.js";
import admin from "../config/fireBase.js";
import UserService from "./userService.js";
import EventService from "./eventService.js";
import RegistrationService from "./registrationService.js";
import StudentService from "./studentService.js";
import { saveNotification } from "../repositories/notificationRepository.js";
import { announcementType } from "../utils/zodAnnouncementValidator.js";




type adminEmailEventType={
    id: string
      title: string,
      location: string,
      imageUrl: string

}
type organizerEventType = {
    id: string
     title: string,
     imageUrl: string
}

class NotificationService {
  async saveNotificationRecord(userId: string,eventId: string, subject: string){
       const user = await UserService.findUserById(userId);
        if(!user){
            return 
        }
        try {
            await saveNotification(user._id.toString(),eventId,subject)
        } catch (error) {
            console.log("Failed to save Notification: "+error)
        }
       
  }
  async sendEmail(to: string, subject: string, html: string, userId?: string,eventId?: string) {
    try {
      const info = await emailTransporter.sendMail({
        from: `"Campus Events" <${env.SENDER_EMAIL}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
    }
    finally{
        if(userId && eventId){
            await this.saveNotificationRecord(userId,eventId,subject);
        }
    }
  }
  async sendPushNotification(userId: string, title: string, body: string) {
    try {
      const user = await UserService.findUserById(userId);
      if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
        console.warn(`Push skipped: No tokens found for user ${userId}`);
        return;
      }
      const message = {
        notification: {
          title,
          body,
        },
        tokens: [...user.fcmTokens],
      };
      const response = await admin.messaging().sendEachForMulticast(message);

      //clean up logic for invalid tokens
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const error = resp.error?.code;
            if (
              error === "messaging/registration-token-not-registered" ||
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
      console.log(
        ` Sent push to ${response.successCount} devices for user ${userId}`
      );
    } catch (error) {
      console.error(" FCM Error:", error);
    }
  }
  // notify admin when new event is created
  async notifyAdminNewEvent(eventDetails: adminEmailEventType) {
    const admins = await AdminService.getAllAdmins();
    if (!admins || admins.length === 0) {
      console.warn("Event created, but no admins exist to notify.");
      return;
    }
    await Promise.all(
      admins.map((admin) => {
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
        return this.sendEmail(admin.email, "New Event Submission", html,admin._id,eventDetails.id);
      })
    );
  }
  // notify organizer about his event status approved or rejected
  async notifyOrganizerEventStatus(
    eventDetails: organizerEventType,
    status: "approved" | "rejected"
  ) {
    const organizer = await OrganizerService.getOrganizerById(eventDetails.id);

    if (!organizer) {
      console.warn(`Event ${status}, but organizer was not found.`);
      return;
    }
    const isApproved = status === "approved";
    const primaryColor = isApproved ? "#22c55e" : "#64748b";
    const statusText = isApproved ? "Approved" : "Review Required";
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
    const subject = isApproved
      ? `🎉 Approved: ${eventDetails.title}`
      : `Rejected: ${eventDetails.title}`;
    return this.sendEmail(organizer.email, subject, html,organizer._id.toString(),eventDetails.id.toString());
  }
  // notify student when his registered event deadline is approching
  async notifyStudentDeadline(userId: string, eventTitle: string) {
    const title = "Event Tomorrow! ⏰";
    const body = `Don't forget! "${eventTitle}" starts in 24 hours. See you there!`;
    await this.sendPushNotification(userId, title, body);
  }
  // the logic for notifystudentdeadline
  async processDailyReminders() {
    const now = new Date();
    const tomorrowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const registrations =
      await RegistrationService.getRegistrationDetailForReminder(
        tomorrowStart,
        tomorrowEnd
      );

    for (const reg of registrations) {
      if (reg.eventId && reg.studentId) {
        const studentId = reg.studentId._id.toString();
        const eventTitle = reg.eventId.title;

        await this.notifyStudentDeadline(studentId, eventTitle);
      }
    }
    console.log(`[Cron] Processed ${registrations.length} reminders.`);
  }
  // notify students when they register for a new event
  async notifyStudentEventRegistrationStatus(
    eventId: string,
    studentId: string,
    status: "registered" | "unregistered"
  ) {
    const [event, student] = await Promise.all([
      EventService.getEventById(eventId),
      StudentService.getStudentById(studentId),
    ]);

    const isRegistered = status === "registered";
    const subject = isRegistered
      ? `Confirmed: ${event.name}`
      : `Cancelled: ${event.name}`;

    // UI Variables
    const themeColor = isRegistered ? "#007bff" : "#6c757d";
    const actionText = isRegistered ? "is confirmed!" : "has been cancelled.";

    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: ${themeColor}; padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 20px;">Event Update</h2>
        </div>

        <div style="padding: 30px; color: #333;">
            <h1 style="font-size: 1.5rem; margin-bottom: 10px;">Hi ${
              student.fullName
            },</h1>
            <p style="font-size: 16px; line-height: 1.5;">
                Your registration for <strong>${
                  event.title
                }</strong> ${actionText}
            </p>

            <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid ${themeColor};">
                <div style="margin-bottom: 5px;"><strong>When:</strong> ${new Date(
                  event.startDate
                ).toLocaleDateString()}</div>
                <div><strong>Where:</strong> ${event.location || "TBD"}</div>
            </div>

            ${
              isRegistered
                ? `
                <p style="font-size: 14px; color: #666;">Please save this email for your records. See you there!</p>
                <a href="" 
                   style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: ${themeColor}; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                   View Event Page
                </a>
            `
                : `
                <p style="font-size: 14px; color: #666;">If this was a mistake, you can re-register on our portal anytime.</p>
            `
            }
        </div>

        <div style="padding: 15px; background: #f4f4f4; text-align: center; font-size: 12px; color: #999;">
            © ${new Date().getFullYear()} Smart Campus
        </div>
    </div>
    `;

    return this.sendEmail(student.email, subject, html,student._id.toString(),event._id.toString());
  }
  // notify students when the event they registered got updated or canceled
  async notifyStudentEventStatus( eventId: string, status: "updated" | "canceled") {
    const registrations =  await RegistrationService.getStudentsRegistrationStatus(eventId);

    if (!registrations || registrations.length === 0) {
      console.warn(`Event ${status}, but no students exist to notify.`);
      return;
    }

    const eventTitle = registrations[0].eventId?.title || "Event";

    // Define dynamic content based on status
    const isCanceled = status === "canceled";
    const statusColor = isCanceled ? "#ef4444" : "#4f46e5"; 
    const subjectLine = isCanceled
      ? `CANCELED: ${eventTitle}`
      : `Update: ${eventTitle}`;
    const mainMessage = isCanceled
      ? `We regret to inform you that ${eventTitle} has been canceled.`
      : `We are reaching out to inform you of a recent update regarding ${eventTitle}.`;
    const subMessage = isCanceled
      ? "If there are any rescheduled dates, they will be posted on your dashboard."
      : "Please check your student dashboard for the most up-to-date information regarding changes to the schedule or venue.";

    const notifications = registrations.map(async (reg) => {
      const student = reg.studentId;
      if (!student) return;

      // 1. Send Push Notification
      if (student.fcmTokens?.length > 0) {
        await this.sendPushNotification(
          student._id.toString(),
          subjectLine,
          `${mainMessage} Check your dashboard for details.`
        );
      }

      // 2. Send Email
      if (student.email) {
        const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: ${statusColor}; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0;">${
                  isCanceled ? "Event Cancellation" : "Event Update"
                }</h2>
            </div>
            <div style="padding: 30px; color: #374151;">
                <h3>${eventTitle}</h3>
                <p>Hello,</p>
                <p>${mainMessage}</p>
                <div style="background-color: #f9fafb; border-left: 4px solid ${statusColor}; padding: 15px; margin: 25px 0;">
                    "${subMessage}"
                </div>
                <div style="text-align: center;">
                    <a href="https://youruniversity.edu/dashboard" 
                       style="background-color: ${statusColor}; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                       View My Dashboard
                    </a>
                </div>
            </div>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                <p>&copy; ${new Date().getFullYear()} Campus Events Team</p>
            </div>
        </div>`;

        await this.sendEmail(student.email, subjectLine, html,student._id.toString(),eventId);
      }
    });

    await Promise.allSettled(notifications);

    console.log(
      `Successfully notified ${registrations.length} students about the ${status} event.`
    );
  }
  async notifyStudentsAnnouncement(announcementData: announcementType){
       try {
         const students = await UserService.getAllStudents()
         if (!students || students.length === 0) {
           console.warn("No students found to notify.");
           return;
         }
         const allTokens: string[] = [];
         students.forEach(student=>{
            if (student.fcmTokens && student.fcmTokens.length > 0) {
              allTokens.push(...student.fcmTokens);
            }
         })
         if (allTokens.length === 0) {
           console.warn("No student tokens available for announcement.");
           return;
         }
         const message = {
           notification: {
             title: announcementData.title,
             body: announcementData.content,
           },
           tokens: allTokens,
         };
         const response = await admin.messaging().sendEachForMulticast(message);
         console.log(`Announcement broadcast: ${response.successCount} successful, ${response.failureCount} failed.`);

       } catch (error) {
         console.error("Broadcast Error:", error);
       }
  }
}

export default new NotificationService();