const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractHoldingsWithAI = async (messyText) => {
    try {
        // gemini-1.5-flash is extremely fast and perfect for text extraction
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are a financial data extraction assistant. I will provide you with messy, unstructured text copied from a Mutual Fund portfolio document. 
        
        Your job is to extract EVERY SINGLE equity holding (Company Name and Weight Percentage) and return them in a strict, valid JSON format. 
        Do not stop at the top 10 or 20; I need the entire list so the total weight adds up to roughly 100%.
        
        Do not include markdown formatting, code blocks, or any conversational text. Return ONLY the JSON.

        The JSON must look exactly like this array format (ensure weights are numbers, not strings):
        [
            { "ticker": "UNKNOWN", "companyName": "Reliance Industries", "weight": 8.5 },
            { "ticker": "UNKNOWN", "companyName": "HDFC Bank", "weight": 6.2 }
        ]

        Here is the messy text to process:
        ${messyText}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Clean the response: LLMs sometimes wrap JSON in markdown blocks like ```json ... ```
        const cleanedJSONString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const holdingsData = JSON.parse(cleanedJSONString);
        return holdingsData;

    } catch (error) {
        console.error(" Gemini AI Extraction Failed:", error.message);
        throw new Error("Failed to parse data with AI. Ensure the text contains holdings data.");
    }
};

module.exports = { extractHoldingsWithAI };