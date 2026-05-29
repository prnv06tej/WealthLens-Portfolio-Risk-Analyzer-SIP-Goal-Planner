const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to pause execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractHoldingsWithAI = async (messyText) => {
  // List of models to try in sequence if one fails or hits a quota limit
  const modelFallbackList = [
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-1.5-flash-latest",
  ];

  let lastError = null;

  // Loop through our fallback models
  for (let i = 0; i < modelFallbackList.length; i++) {
    const currentModelName = modelFallbackList[i];

    // Try up to 2 times per model with a short pause if rate-limited
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(
          ` AI Parsing Attempt ${attempt} using model: ${currentModelName}...`,
        );

        const model = genAI.getGenerativeModel({ model: currentModelName });

        const prompt = `
          You are a financial data extraction assistant. I will provide you with messy, unstructured text copied from a Mutual Fund portfolio document. 

          Your job is to extract EVERY SINGLE equity holding (Company Name and Weight Percentage) and return them in a strict, valid JSON format. 
          I need the entire list so the total weight adds up to roughly 100%.

          CRITICAL FOR UNIQUE TICKERS: For each company, provide their official Indian stock exchange ticker symbol if you know it (e.g., "RELIANCE", "HDFCBANK", "INFY"). 
          If you do not know the exact ticker symbol, create a clean, unique 4-6 letter uppercase shorthand ticker based on the company's name (e.g., "ABCIND" for ABC Industries). Do NOT use generic words like "UNKNOWN" or "TICKER". Every single item must have a distinct ticker code.

          Do not include markdown formatting, code blocks, or any conversational text. Return ONLY the JSON.

          The JSON must look exactly like this array format:
          [
              { "ticker": "RELIANCE", "companyName": "Reliance Industries Ltd", "weight": 8.5 },
              { "ticker": "HDFCBANK", "companyName": "HDFC Bank Ltd", "weight": 6.2 }
          ]

          Here is the messy text to process:
          ${messyText}
          `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleanedJSONString = responseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const holdingsData = JSON.parse(cleanedJSONString);

        return holdingsData;
      } catch (error) {
        lastError = error;
        console.warn(
          `Attempt with ${currentModelName} failed: ${error.message}`,
        );

        // If it's a rate limit or busy server, wait 3 seconds before retrying
        if (error.message.includes("429") || error.message.includes("503")) {
          console.log(
            " Hitting quota/rate limit. Pausing for 3 seconds before next attempt...",
          );
          await delay(3000);
        } else {
          // If it's a structural syntax error, break early and try the next model
          break;
        }
      }
    }
  }

  // If the code reaches here, all models and retries failed
  console.error(
    "All fallback models exhausted. AI Extraction Pipeline crashed.",
  );
  throw new Error(
    `AI Extraction failed after multiple retries. Original error: ${lastError.message}`,
  );
};

module.exports = { extractHoldingsWithAI };
