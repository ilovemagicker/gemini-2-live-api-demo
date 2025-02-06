import { GeminiAgent } from './main/agent.js';
import { getConfig, getWebsocketUrl, getDeepgramApiKey, MODEL_SAMPLE_RATE } from './config/config.js';

import { GoogleSearchTool } from './tools/google-search.js';
import { ToolManager } from './tools/tool-manager.js';
import { ChatManager } from './chat/chat-manager.js';

import { setupEventListeners } from './dom/events.js';

const url = getWebsocketUrl();
const config = getConfig();
const deepgramApiKey = getDeepgramApiKey();

const toolManager = new ToolManager();
toolManager.registerTool('googleSearch', new GoogleSearchTool());

const chatManager = new ChatManager();

const geminiAgent = new GeminiAgent({
    url,
    config,
    deepgramApiKey,
    modelSampleRate: MODEL_SAMPLE_RATE,
    toolManager
});

// Handle chat-related events
geminiAgent.on('transcription', (transcript) => {
    chatManager.updateStreamingMessage(transcript);
});

geminiAgent.on('text_sent', (text) => {
    chatManager.finalizeStreamingMessage();
    chatManager.addUserMessage(text);
});

geminiAgent.on('interrupted', () => {
    chatManager.finalizeStreamingMessage();
    if (!chatManager.lastUserMessageType) {
        chatManager.addUserAudioMessage();
    }
});

geminiAgent.on('turn_complete', () => {
    chatManager.finalizeStreamingMessage();
});

geminiAgent.connect();

setupEventListeners(geminiAgent);

window.addEventListener('DOMContentLoaded', async () => {
    try {
        // 確保環境變數存在
        if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY && !localStorage.getItem('apiKey')) {
            console.warn('API key not found in environment variables or localStorage');
        }
        
        if (!process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY && !localStorage.getItem('deepgramApiKey')) {
            console.warn('Deepgram API key not found in environment variables or localStorage');
        }

        // 初始化其他組件
        // ... existing initialization code ...
    } catch (error) {
        console.error('Initialization error:', error);
    }
});