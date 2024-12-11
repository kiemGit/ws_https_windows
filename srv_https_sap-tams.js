const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

// Load SSL certificates
const serverOptions = {
    cert: fs.readFileSync('sap-tams.co.id.cer'), // Replace with your certificate file
    key: fs.readFileSync('sap-tams.co.id.key')   // Replace with your key file
};

// Create an HTTPS server
const httpsServer = https.createServer(serverOptions);

// Create a WebSocket server on top of the HTTPS server
const wss = new WebSocket.Server({ server: httpsServer });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Listen for messages from the client
    ws.on('message', (message) => {
        console.log('Received message:', message);

        // Try to parse the incoming message as JSON
        try {
            const data = JSON.parse(message);

            // Broadcast the message to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    // Send JSON data to the client
                    client.send(JSON.stringify({
                        type: 'broadcast',
                        // message: data.message,
                        message: data,
                        // sender: data.sender,
                        timestamp: new Date().toISOString()
                    }));
                }
            });
        } catch (error) {
            console.error('Error parsing message as JSON:', error);
        }
    });

    // Handle when a client disconnects
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the HTTPS server
const PORT = 443; // Use 443 for secure connections
httpsServer.listen(PORT, () => {
    console.log(`Secure WebSocket server is running on wss://gdsap.work.gd./:${PORT}`);
});
