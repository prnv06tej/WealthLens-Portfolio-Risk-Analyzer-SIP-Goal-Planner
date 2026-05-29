require('dotenv').config();

const checkModels = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        
        const data = await response.json();
        
        if (data.models) {
            console.log("✅ SUCCESS! Google says your API key can use these models:");
            const modelNames = data.models.map(m => m.name.replace('models/', ''));
            console.log(modelNames);
        } else {
            console.log("❌ API Key Error:", data);
        }
    } catch (error) {
        console.error("❌ Fetch Error:", error.message);
    }
};

checkModels();