export const getWebsocketUrl = () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || localStorage.getItem('apiKey');
    if (!apiKey) {
        throw new Error('Gemini API key not found. Please check your environment variables or settings.');
    }
    return `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
};

export const getDeepgramApiKey = () => {
    const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || localStorage.getItem('deepgramApiKey');
    if (!apiKey) {
        throw new Error('Deepgram API key not found. Please check your environment variables or settings.');
    }
    return apiKey;
};

// Audio Configurations
export const MODEL_SAMPLE_RATE = parseInt(localStorage.getItem('sampleRate')) || 27000;

const thresholds = {
    0: "BLOCK_NONE",
    1: "BLOCK_ONLY_HIGH",
    2: "BLOCK_MEDIUM_AND_ABOVE",
    3: "BLOCK_LOW_AND_ABOVE"
}

export const getConfig = () => ({
    model: 'models/gemini-2.0-flash-exp',
    generationConfig: {
        temperature: parseFloat(process.env.NEXT_PUBLIC_TEMPERATURE || localStorage.getItem('temperature')) || 1.8,
        top_p: parseFloat(process.env.NEXT_PUBLIC_TOP_P || localStorage.getItem('top_p')) || 0.95,
        top_k: parseInt(process.env.NEXT_PUBLIC_TOP_K || localStorage.getItem('top_k')) || 65,
        responseModalities: "audio",
        speechConfig: {
            voiceConfig: { 
                prebuiltVoiceConfig: { 
                    voiceName: localStorage.getItem('voiceName') || 'Aoede'
                }
            }
        }
    },
    systemInstruction: {
        parts: [{
            text: localStorage.getItem('systemInstructions') || "You are a helpful assistant"
        }]
    },
    tools: {
        functionDeclarations: [],
    },
    safetySettings: [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": thresholds[localStorage.getItem('harassmentThreshold')] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": thresholds[localStorage.getItem('dangerousContentThreshold')] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": thresholds[localStorage.getItem('sexuallyExplicitThreshold')] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": thresholds[localStorage.getItem('hateSpeechThreshold')] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
        },
        {
            "category": "HARM_CATEGORY_CIVIC_INTEGRITY",
            "threshold": thresholds[localStorage.getItem('civicIntegrityThreshold')] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
        }
    ]
});

export const config = {
    production: {
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
        deepgramApiKey: process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY,
    },
    development: {
        apiUrl: 'http://localhost:3000',
        websocketUrl: 'ws://localhost:3000',
        deepgramApiKey: '',
    }
};

export const getCurrentConfig = () => {
    return process.env.NODE_ENV === 'production' ? config.production : config.development;
};