const fs = require('fs');
const path = require('path');

// 讀取 index.html
let html = fs.readFileSync('index.html', 'utf8');

// 替換環境變數
const envVars = {
    'NEXT_PUBLIC_GEMINI_API_KEY': process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    'NEXT_PUBLIC_DEEPGRAM_API_KEY': process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY,
    'NEXT_PUBLIC_TEMPERATURE': process.env.NEXT_PUBLIC_TEMPERATURE,
    'NEXT_PUBLIC_TOP_P': process.env.NEXT_PUBLIC_TOP_P,
    'NEXT_PUBLIC_TOP_K': process.env.NEXT_PUBLIC_TOP_K
};

Object.entries(envVars).forEach(([key, value]) => {
    html = html.replace(`__${key}__`, value || '');
});

// 寫入修改後的文件
fs.writeFileSync('index.html', html); 