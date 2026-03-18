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
      const feedbacks = await findOrganizerFeedbacks(organizerId);
      if (!feedbacks) {
        throw new AppError("Could not retrieve feedbacks", 500);
      }
      return feedbacks.filter(feedback=>feedback.eventId !== null);
    }
    async getAverageRating(organizerId: string){
       const averageRating = await findOrganizerAverageRating(organizerId);
       return averageRating;
    }

}

export default new FeedbackService()