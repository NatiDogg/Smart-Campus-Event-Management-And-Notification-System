import eventModel from "../models/eventModel.js";
import interestModel from "../models/interestModel.js";
import registrationModel from "../models/registrationModel.js";
import recommendationModel from "../models/recommendationModel.js";
import subscriptionModel from '../models/subscriptionModel.js'
import { env } from "../utils/zodEnvFilesValidator.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Types } from "mongoose";

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  
  async refreshStudentRecommendations(studentId: string) {
    try {
      const aiResults = await this.generateStudentRecommendations(studentId);

      if (!aiResults || !Array.isArray(aiResults) || aiResults.length === 0) return null;

      
      const updatedRecs = await recommendationModel.findOneAndUpdate(
        { studentId: new Types.ObjectId(studentId) },
        {
          eventId: aiResults, 
        },
        { upsert: true,  returnDocument: 'after' }
      );

      return updatedRecs;
    } catch (error) {
      console.error("Failed to refresh recommendations:", error);
      return null;
    }
  }

  /**
   * Internal logic to communicate with Gemini
   */
  private async generateStudentRecommendations(studentId: string) {
    try {
      const [history, interestedEvents, upcomingEvents,subscribedEvents] = await Promise.all([
        registrationModel.find({ studentId: new Types.ObjectId(studentId) }).populate({
          path: "eventId",
          select: "title category description",
          populate: { path: "category", select: "name" },
        }).limit(5),
        interestModel.find({ studentId: new Types.ObjectId(studentId), interestType: "interested" }).populate({
          path: "eventId",
          select: "title category description",
          populate: { path: "category", select: "name" },
        }),
        eventModel.find({ status: "approved", endDate: { $gte: new Date() } })
          .select("title category description _id")
          .populate("category", "name")
          .limit(15),
        subscriptionModel.findOne({studentId: new Types.ObjectId(studentId)}).populate("preferredCategories", "name")
      ]);

      const historyList = history.map(h => {
        const e = h.eventId as any;
        return `${e?.title} (${e?.category?.name})`;
      }).join(", ");

      const interestList = interestedEvents.map(i => {
        const e = i.eventId as any;
        return `${e?.title} (${e?.category?.name})`;
      }).join(", ");

      const upcomingList = upcomingEvents.map(e => ({
        id: e._id,
        title: e.title,
        category: (e.category as any)?.name,
        description: e.description
      }));
      const preferredCategoriesList = subscribedEvents?.preferredCategories
  ? subscribedEvents.preferredCategories.map((cat: any) => cat.name).join(", ")
  : "No preferred categories set";

      const systemPrompt = `
        ROLE: 
        You are the "Smart Campus AI," a university event recommendation engine.
        
        CONTEXT:
        - Subscribed Categories (Broad Interests): ${preferredCategoriesList}
        - Registration History (Past Actions): ${historyList || "New User (No history yet)"}
        - Explicit Interests (Wishlist): ${interestList || "New User (No interests marked yet)"}
        
        DATA POOL (Upcoming Events):
        ${JSON.stringify(upcomingList)}

        TASK:
        1. Select 3-5 best event IDs from the DATA POOL that the student has not yet registered for in their Registration History.
        2. If the student is a "New User," select 3-5 diverse events (e.g., one tech, one social, one career) to help them explore the campus.
        3. If the student has subscribed categories, history or interests, prioritize matching those themes
        4. Return ONLY a raw JSON array of strings (the event IDs).
        5. DO NOT return objects, DO NOT return reasons.
        6. NO markdown, NO code blocks.

        EXAMPLE OUTPUT:
        ["65d2f...", "65d3a..."]
      `;

      console.log("Ai Model started recommending...")
      const result = await this.model.generateContent(systemPrompt);
      const responseText = result.response.text().trim();
       console.log(responseText);
      // Remove backticks and parse the array of strings
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const parsedIds = JSON.parse(cleanJson);
      

      return Array.isArray(parsedIds) ? parsedIds : [];

    } catch (error) {
      console.error("AI Generation Error:", error);
      return [];
    }
  }

  async getRecommendations(studentId: string){
     const recommendations = await recommendationModel.findOne({ studentId }).populate({
      path: "eventId",
      match:{endDate: {$gte: new Date()}},
      populate: { path: "category", select: "name" } 
    }).lean();
    return recommendations?.eventId.filter((e:any)=>e !== null) || [];
  }
}

export default new AIService();

  















