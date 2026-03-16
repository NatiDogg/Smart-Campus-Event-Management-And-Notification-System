import { findAnnouncements } from "../repositories/announcementRepository.js";


class AnnouncementService{
        async getAnnouncements(){
            const announcements = await findAnnouncements();
            return announcements
        }
}

export default new AnnouncementService();