
import AppError from "../utils/appError.js";
import { hashPassword } from "../utils/bcryptjs.js";
import { categoryCreationType } from "../utils/zodCategoryValidator.js";
import { organizerCreationType } from "../utils/zodOrganizerValidator.js";
import CategoryService from "./categoryService.js";
import EventService from "./eventService.js";
import UserService from "./userService.js";
import { createAdmin, findAllAdmins } from "../repositories/adminRepository.js";
import { adminTypeDto } from "../repositories/adminRepository.js";
import OrganizerService from "./organizerService.js";
import NotificationService from "./notificationService.js";
import { announcementType } from "../utils/zodAnnouncementValidator.js";
import { createNewAnnouncement } from "../repositories/announcementRepository.js";
class AdminService{
       async createNewAdmin(adminData: adminTypeDto){
         const newlyCreatedAdmin = await createAdmin(adminData)
         return newlyCreatedAdmin;
       }
       async createOrganizer(organizerData:organizerCreationType){
           const normalizedEmail = organizerData.email.toLowerCase()
           const organizer = await UserService.findUserByEmail(normalizedEmail);

           if(organizer){
              throw new AppError("organizer already Created!",400)
           }
            const hashedPassword = await hashPassword(organizerData.password)
             if(!hashedPassword){
                 throw new AppError("Something went wrong storing your password! please try again",400);
              }

           const newlyCreatedOrganizer = await OrganizerService.createNewOrganizer({...organizerData, email: normalizedEmail, password: hashedPassword});
              
           if(!newlyCreatedOrganizer){
            throw new AppError("cant create a new organizer now. Please try again!",400)
           }
           const Neworganizer = newlyCreatedOrganizer.toObject()
           delete Neworganizer.password

           return {
            success: true,
            message: "Organizer Created Successfully!",
            organizer: Neworganizer
           }

          
       }
       async createNewCategory(categoryData: categoryCreationType){
            const existingCategory = await CategoryService.findMatchingCategory(categoryData.name)
            if(existingCategory){
                throw new AppError("Category already Created!",400)
            }
            const newlyCreatedCategory = await CategoryService.createNewCategory(categoryData);
            if(!newlyCreatedCategory){
                throw new AppError("Cant create Category right now. Please try again!",400)
            }
            return {
               success: true,
               message: "New Category Created Successfully",
               newlyCreatedCategory
            }
       }
       async createAnnouncement(announcementData: announcementType){
          const newlyCreatedAnnouncement = await createNewAnnouncement(announcementData);
          if(!newlyCreatedAnnouncement){
            throw new AppError("Failed to create Announcement. Please try again!",400);
          }
          //send announcemnt to all students
          void NotificationService.notifyStudentsAnnouncement({title:newlyCreatedAnnouncement.title, content: newlyCreatedAnnouncement.content});
          return {
            success: true,
            message: "New Announcement Created Successfully!"
          }
       }
       async approveEvent(eventId: string){
           const updatedEvent = await EventService.processEventApproval(eventId)
           if(!updatedEvent){
             throw new AppError("Event Not Found!!",404)
           }
            void NotificationService.notifyOrganizerEventStatus({
              id: updatedEvent.organizedBy,
              title: updatedEvent.title,
              imageUrl: updatedEvent.imageUrl
            }, "approved")


           return {
             success: true,
             message: "Event Approved Successfully",
             updatedEvent
           }
       }
       async rejectEvent(eventId: string){
          const rejectedEvent = await EventService.processEventRejection(eventId)
           if(!rejectedEvent){
             throw new AppError("Event Not Found!!",404)
           }
            void NotificationService.notifyOrganizerEventStatus({
              id: rejectedEvent.organizedBy,
              title: rejectedEvent.title,
              imageUrl: rejectedEvent.imageUrl
            }, "rejected")

           return {
             success: true,
             message: "Event Rejected Successfully",
             rejectedEvent
           }

       }
       async getAllUsers(){
         const users = await UserService.getUsers()
          return {
            success: true,
            message: "All Users Retreived Successfully",
            users
          }

       }
       async deactivateUser(userId: string){
          const deactivatedUser = await UserService.deactivateUser(userId)
          if(!deactivatedUser){
            throw new AppError("cant deactivate user right now!",400)
          }
          return {
            success: true,
            message: "User Deactivated Successfully",
            deactivatedUser

          }
       }
       async getAllEvents(){
         const events = EventService.getAllAdminEvents()
         return {
          success: true,
          message: "Events Retreived Successfully",
          events
         }
       }
       async getAllAdmins(){
         const admins = await findAllAdmins()
         return admins;
       }
       
}

export default new AdminService();
