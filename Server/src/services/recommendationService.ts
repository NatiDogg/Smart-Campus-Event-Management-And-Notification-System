import { env } from "../utils/zodEnvFilesValidator.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

export async function run(){
  try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = 'whats node js and which one is the best express or nest js';
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    } catch (error) {
       console.error("🚨 API Limit Hit: Wait a minute before trying again.");
    }
}

