import { findAnnouncements,createNewAnnouncement } from "../repositories/announcementRepository.js";
import AppError from "../utils/appError.js";
import { announcementType } from "../utils/zodAnnouncementValidator.js";
import NotificationService from "./notificationService.js";


class AnnouncementService{
        async getAnnouncements(){
            const announcements = await findAnnouncements();
            return announcements
        }
        async createAnnouncement(announcementData: announcementType){
           const newlyCreatedAnnouncement = await createNewAnnouncement(announcementData);
           if(!newlyCreatedAnnouncement){
            throw new AppError("Failed to create Announcement. Please try again!",400);
          }
          //send announcemnt to all students
          void NotificationService.notifyStudentsAnnouncement({title:newlyCreatedAnnouncement.title, content: newlyCreatedAnnouncement.content});
          return newlyCreatedAnnouncement;
        }
}

export default new AnnouncementService();