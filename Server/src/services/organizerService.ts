import { createOrganizer, findOrganizerById } from "../repositories/organizerRepository.js"
import { organizerCreationType } from "../utils/zodOrganizerValidator.js";

class OrganizerService{
     async createNewOrganizer(organizerData:organizerCreationType){
        const newlyCreatedOrganizer = await createOrganizer(organizerData)
        return newlyCreatedOrganizer;
     }
     async getOrganizerById(organizerId: string){
        const organizer = await findOrganizerById(organizerId);
        return organizer

     }
}

export default new OrganizerService()