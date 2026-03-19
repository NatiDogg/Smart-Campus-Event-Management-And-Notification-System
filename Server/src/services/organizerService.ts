import { createOrganizer, findOrganizerById } from "../repositories/organizerRepository.js"
import AppError from "../utils/appError.js";
import { hashPassword } from "../utils/bcryptjs.js";
import { organizerCreationType } from "../utils/zodOrganizerValidator.js";
import UserService from "./userService.js";

class OrganizerService{
     async createNewOrganizer(organizerData:organizerCreationType){
        const newlyCreatedOrganizer = await createOrganizer(organizerData)
        return newlyCreatedOrganizer;
     }
     async getOrganizerById(organizerId: string){
        const organizer = await findOrganizerById(organizerId);
        return organizer

     }
     async registerNewOrganizer(organizerData: organizerCreationType){
        const normalizedEmail = organizerData.email.toLowerCase();
        const existingUser = await UserService.findUserByEmail(normalizedEmail);
        if (existingUser) {
            throw new AppError("A user with this email already exists!", 400);
        }

       const hashedPassword = await hashPassword(organizerData.password);
       const newlyCreatedOrganizer = await this.createNewOrganizer({...organizerData,
            email: normalizedEmail,
            password: hashedPassword})
            if (!newlyCreatedOrganizer) {
              throw new AppError( "cant create a new organizer now. Please try again!", 400 );
            }
            const newOrganizer = newlyCreatedOrganizer.toObject()
             delete newOrganizer.password
             return newOrganizer
     }
}

export default new OrganizerService()