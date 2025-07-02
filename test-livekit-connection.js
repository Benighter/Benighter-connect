// Simple test script to check LiveKit server connectivity
const WebSocket = require('ws');

const servers = [
    'wss://meet.livekit.io',
    'wss://demo.livekit.io',
    'wss://livekit-demo.livekit.cloud',
    'ws://localhost:7880'
];

async function testServer(url) {
    return new Promise((resolve) => {
        console.log(`Testing ${url}...`);
        
        const ws = new WebSocket(url);
        
        const timeout = setTimeout(() => {
            ws.close();
            resolve({ url, status: 'timeout' });
        }, 5000);
        
        ws.on('open', () => {
            clearTimeout(timeout);
            ws.close();
            resolve({ url, status: 'success' });
        });
        
        ws.on('error', (error) => {
            clearTimeout(timeout);
            resolve({ url, status: 'error', error: error.message });
        });
    });
}

async function testAllServers() {
    console.log('🔍 Testing LiveKit server connections...\n');
    
    for (const server of servers) {
        const result = await testServer(server);
        
        if (result.status === 'success') {
            console.log(`✅ ${result.url} - Connected successfully`);
        } else if (result.status === 'timeout') {
            console.log(`⏱️  ${result.url} - Connection timeout`);
        } else {
            console.log(`❌ ${result.url} - Error: ${result.error}`);
        }
    }
    
    console.log('\n🎯 Recommendation: Use a server that shows "Connected successfully"');
}

testAllServers().catch(console.error);
