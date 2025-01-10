import initializeSwarm from "../hyperswarm";
import { initializeHyperBee } from "../hyperbee";
import process from 'bare-process';

export function startChat() {
    const channelName = process.argv[5] || 'default-room';

    // Initialize swarm for peer-to-peer communication and the Hyperbee database for message persistence
    const swarm = initializeSwarm(channelName);
    const db = initializeHyperBee('./data/chat-history');

    // Listen for messages from connected peers and save them to the database
    swarm.on('connection', connection => {
        connection.on('data', data => {
            const message = data.toString();
            const timestamp = Date.now();

            // Save to the Hyperbee database
            const timestampBuffer = Buffer.from(String(timestamp));
            const messageBuffer = Buffer.from(message);

            db.put(timestampBuffer, messageBuffer, (err) => {
                if (err) {
                    console.error('Error saving message:', err);
                }
            });

            // Print received message to the console with a timestamp
            console.log(`[${new Date(timestamp)}]: ${message}`);
        });
    });

    // Send messages from stdin and broadcast to connected peers
    process.stdin.on('data', data => {
        const message = data.toString().trim();
        const timestamp = Date.now();

        // Save the message to the Hyperbee database
        const timestampBuffer = Buffer.from(String(timestamp));
        const messageBuffer = Buffer.from(message);

        db.put(timestampBuffer, messageBuffer, (err) => {
            if (err) {
                console.error('Error saving message:', err);
            }
        });

        // Broadcast message to connected peers
        swarm.connections.forEach(connection => {
            connection.write(data);
        });

        // Print the sent message to the console
        console.log(`[You]: ${message}`);
    });

    // Handle errors in unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.error('Unhandled Rejection:', err);
        process.exit(1);
    });

    console.log(`Chat initialized in channel: ${channelName}`);
}
