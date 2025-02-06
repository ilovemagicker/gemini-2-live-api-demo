const fs = require('fs-extra');
const path = require('path');

async function build() {
    try {
        console.log('Starting build process...');

        // 讀取 index.html
        let html = await fs.readFile('index.html', 'utf8');
        console.log('Read index.html successfully');

        // 替換環境變數
        const envVars = {
            'NEXT_PUBLIC_GEMINI_API_KEY': process.env.NEXT_PUBLIC_GEMINI_API_KEY,
            'NEXT_PUBLIC_DEEPGRAM_API_KEY': process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY,
            'NEXT_PUBLIC_TEMPERATURE': process.env.NEXT_PUBLIC_TEMPERATURE || '1.8',
            'NEXT_PUBLIC_TOP_P': process.env.NEXT_PUBLIC_TOP_P || '0.95',
            'NEXT_PUBLIC_TOP_K': process.env.NEXT_PUBLIC_TOP_K || '65'
        };

        console.log('Replacing environment variables...');
        Object.entries(envVars).forEach(([key, value]) => {
            const placeholder = `__${key}__`;
            html = html.replace(placeholder, value || '');
            console.log(`Replaced ${placeholder} with ${value ? '[value]' : 'empty string'}`);
        });

        // 寫入修改後的文件
        await fs.writeFile('index.html', html);
        console.log('Build completed successfully');

    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build(); 