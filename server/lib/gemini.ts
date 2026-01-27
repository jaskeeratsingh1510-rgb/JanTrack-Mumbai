import { storage } from "../storage";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Using the experimental model as verified by user, can fallback to gemini-1.5-flash if needed
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is missing");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Simple in-memory cache to save quota
const responseCache = new Map<string, { reply: string, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

export async function getChatResponse(message: string) {
    try {
        // Check cache first
        const cacheKey = message.toLowerCase().trim();
        const cached = responseCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            console.log("Serving from cache:", message);
            return cached.reply;
        }

        // Fetch real-time data from database
        const candidates = await storage.getCandidates();

        // Create a summary of candidates for the AI
        const candidateContext = candidates.map(c => {
            const promisesSummary = c.promises ? c.promises.map((p: any) => p.title).join(", ") : "No promises listed";
            const projectsSummary = c.funds?.projects ? c.funds.projects.map((p: any) => `${p.name} (₹${p.cost}L)`).join(", ") : "No projects";

            return `
- CANDIDATE: ${c.name} (${c.party})
  * Ward: ${c.ward}
  * Bio: ${c.bio || "N/A"}
  * Age: ${c.age}, Gender: ${c.gender}, Education: ${c.education}
  * Criminal Cases: ${c.criminalCases}, Assets: ${c.assets}, Attendance: ${c.attendance}%
  * Funds: Allocated ₹${c.funds?.allocated} Cr, Utilized ₹${c.funds?.utilized} Cr
  * Key Projects: ${projectsSummary}
  * Promises: ${promisesSummary}
             `.trim();
        }).join("\n\n");

        const DYNAMIC_CONTEXT = `
You are "JanSahayak", a helpful AI civic assistant for Mumbai.
You have access to the REAL-TIME database of candidates:

${candidateContext}

OFFICIAL WARD DATA:
- Ward A: Colaba
- Ward K/W: Andheri West
- Ward K/E: Andheri East
... (and so on)

If asked about a candidate, use the specific details from the list above.
If the candidate is not in the list, say "I don't have information on that candidate yet."

IMPORTANT: Keep your answer concise (under 100 words) to save time.
`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: DYNAMIC_CONTEXT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Namaste! I have read the live database. I am ready to answer questions about these candidates." }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const textElement = response.text();

        // Cache the successful response
        responseCache.set(cacheKey, { reply: textElement, timestamp: Date.now() });

        return textElement;
    } catch (error: any) {
        console.error("Gemini AI Error Detail:", JSON.stringify(error, null, 2));

        // Handle Rate Limiting specifically

        if (error.message?.includes("429") || error.status === 429) {
            return "I am currently receiving too many questions. Please wait a minute and try again. (Daily Limit Reach d)";
        }


        if (error.status === 429) {
            return "I am currently receiving too many questions. Please wait a minute and try again. (Server is busy)";
        }

        return `I'm having trouble processing that right now. Please try again later. (Error: ${error.message})`;
    }
}
