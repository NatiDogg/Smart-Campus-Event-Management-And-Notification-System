import announcementModel from "../models/announcementModel.js";
import { announcementType } from "../utils/zodAnnouncementValidator.js";

export const createNewAnnouncement = (announcementData: announcementType)=>{
    return announcementModel.create(announcementData);
}

export const findAnnouncements = ()=>{
    return announcementModel.find({}).sort({createdAt: -1})
}