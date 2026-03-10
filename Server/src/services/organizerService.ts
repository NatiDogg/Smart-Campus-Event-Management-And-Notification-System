import { createOrganizer } from "../repositories/organizerRepository.js"
import { organizerCreationType } from "../utils/zodOrganizerValidator.js";

class OrganizerService{
     async createNewOrganizer(organizerData:organizerCreationType){
        const newlyCreatedOrganizer = await createOrganizer(organizerData)
        return newlyCreatedOrganizer;
     }
}

export default new OrganizerService()