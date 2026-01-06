// API Configuration
const API_CONFIG = {
    // Production (จะใส่ทีหลัง)
    BACKEND_URL: 'https://ai-robot-api.YOUR-DOMAIN.com',
    WS_URL: 'wss://ai-robot-api.YOUR-DOMAIN.com',
    
    // Development (ใช้ตอนนี้)
    // BACKEND_URL: 'http://192.168.1.59:4188',
    // WS_URL: 'ws://192.168.1.59:4188',
};

console.log('🔗 Backend URL:', API_CONFIG.BACKEND_URL);
console.log('🔗 WebSocket URL:', API_CONFIG.WS_URL);
