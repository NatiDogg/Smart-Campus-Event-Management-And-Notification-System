import { checkAlreadySubmittedFeedback, createNewFeedback, findOrganizerAverageRating, findOrganizerFeedbacks } from "../repositories/feedbackRepository.js";
import { feedbackType } from "../utils/zodFeedbackValidator.js";
import AppError from "../utils/appError.js";

class FeedbackService{
    async submitFeedback(feedbackData: feedbackType,studentId: string, eventId: string){
        const alreadyExists = await this.checkStudentFeedback(studentId, eventId);
        if(alreadyExists){
            throw new AppError("You have already submitted feedback for this event.", 400);
        }

        const newlySubmittedFeedback = await createNewFeedback(feedbackData,studentId, eventId);
        if(!newlySubmittedFeedback){
            throw new AppError("Failed to Submit Feedback right now!",500);
        }
        return {
            success: true,
            message: "Feedback Submitted Successfully!",
            newlySubmittedFeedback
        }
    }
    async checkStudentFeedback(studentId: string, eventId: string){
      const feedback = await checkAlreadySubmittedFeedback(studentId, eventId);
      return  feedback;
    }
    async getOrganizerFeedbacks(organizerId: string){
      const rawFeedbacks = await findOrganizerFeedbacks(organizerId);
      if (rawFeedbacks === null || rawFeedbacks === undefined) {
        
        throw new AppError("Could not retrieve feedbacks", 500);
      }
     const filteredFeedbacks = rawFeedbacks.filter(f => f.eventId !== null);
     return filteredFeedbacks;

    }
    async getAverageRating(organizerId: string){
       const averageRating = await findOrganizerAverageRating(organizerId);
       return averageRating;
    }

}

export default new FeedbackService()