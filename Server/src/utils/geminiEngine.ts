// utils/geminiEngine.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./zodEnvFilesValidator.js";
// Ensure your API key is set in your .env file
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const callGeminiEngine = async(briefingData: any) => {
  // Use flash for speed and lower latency in a dashboard environment
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    You are the Lead Data Analyst for a Smart Campus. 
    Analyze this data: ${JSON.stringify(briefingData)}

    --- CORE ANALYTICAL TASKS ---
    1. SUMMARY: Compare engagement across categories. Mention % increases if registrations are high. If data is sparse, provide an encouraging administrative overview.
    2. PREDICTION: Look at 'futurePipeline'. Pick the most prominent upcoming event and predict turnout based on past 'attendanceRate' for that category.
    3. RANKING: Identify the top 3 events from 'performance'. Label them as (High Engagement), (High Interest), or (Consistent Popularity).
    4. TABLE DATA: For each event in 'performance',include the registration count, the attendanceRate (as a percentage string, e.g., "85%"), assign an 'engagementScore' (Low/Medium/High) and a calculated 'impact' percentage (e.g., "+12.4%") based on registration vs capacity.

    --- CRITICAL HANDLING & FALLBACK RULES ---
    1. NO DATA STATUS: If 'performance' and 'futurePipeline' are both empty, set 'summary' to: "Welcome to the new month! Currently, no event data is available to analyze. Start by approving pending events or creating new ones."
    2. PREDICTION FALLBACK: If 'futurePipeline' is empty, set 'turnoutPrediction' to: "No upcoming events scheduled. Prediction will resume once events are approved."
    3. RANKING FALLBACK: If there are fewer than 3 events, only return the existing events. If zero events exist, return an empty array [].
    4. TABLE FALLBACK: If 'performance' is empty, return 'tableMetrics' as an empty array [].
    5. PENDING AWARENESS: If events exist in 'futurePipeline' but are all "pending", explicitly mention in the 'summary' that engagement insights are waiting on pending admin approvals.
    6. NEW EVENT LOGIC: If an event has 0 registrations but is scheduled for the future or was just created, set impact to '0.0%', attendanceRate to '0%' and score to 'Neutral' instead of 'Low' to avoid discouraging the admin.

    --- OUTPUT REQUIREMENT ---
    Generate a JSON response that fits the Admin Dashboard perfectly. 
    DO NOT include markdown formatting, ONLY return the raw JSON object.

    RETURN ONLY THIS JSON FORMAT:
    {
      "summary": "string",
      "turnoutPrediction": "string",
      "engagementTrend": "string",
      "topEvents": ["string", "string", "string"],
      "tableMetrics": [
        { "title": "string", "registrations": number,"attendanceRate": "string", "score": "string", "impact": "string" }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log(responseText)
    
    // Clean markdown blocks if the AI accidentally includes them
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Analytics Engine Error:", error);
    
    // Safety Fallback: Ensuring the UI doesn't break if the AI is down or the JSON is malformed
    return {
      isError: true,
      summary: "The analytics engine is currently syncing. Please check back in a few moments for updated insights.",
      turnoutPrediction: "Prediction unavailable",
      engagementTrend: "Analyzing student activity...",
      topEvents: [],
      tableMetrics: []
    };
  }
};