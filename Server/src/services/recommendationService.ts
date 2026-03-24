import { env } from "../utils/zodEnvFilesValidator.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

export async function run(){
  try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = 'hello gemini';
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    } catch (error) {
       console.error('Failed to Load AI:' +error);
    }
}

