import { GeminiAgent } from './main/agent.js';
import { getConfig, getWebsocketUrl, getDeepgramApiKey, MODEL_SAMPLE_RATE } from './config/config.js';

import { GoogleSearchTool } from './tools/google-search.js';
import { ToolManager } from './tools/tool-manager.js';
import { ChatManager } from './chat/chat-manager.js';

import { setupEventListeners } from './dom/events.js';

const initializeApp = async () => {
    try {
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

        await geminiAgent.connect();
        setupEventListeners(geminiAgent);

    } catch (error) {
        console.error('Initialization error:', error);
        alert('初始化失敗，請檢查 API 金鑰設定是否正確。');
    }
};

// 等待 DOM 載入完成後初始化
window.addEventListener('DOMContentLoaded', initializeApp);