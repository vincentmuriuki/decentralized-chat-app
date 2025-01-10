import Hyperswarm from 'hyperswarm'
import { initializeHypercore } from './hypercore.js'
import { initializeHyperBee } from './hyperbee.js'
import process from 'bare-process'
import crypto from 'hypercore-crypto'
// import Hypercore from 'hypercore'
import b4a from 'b4a'
import path from 'bare-path'
// import ram from 'random-access-memory'
// import Hyperbee from 'hyperbee'
// console.log('pprocess------------------', process)
// Initialize Hyperswarm and Hyperbee instances
const swarm = new Hyperswarm()

Pear.teardown(() => swarm.destroy());

const storagePath = path.join(
    Pear.config.storage || './chat-history',
    `session-${Date.now()}`
);

// Initialize Hypercore and Hyperbee
const feed = initializeHypercore(storagePath)
const db = initializeHyperBee(feed)

await db.ready()

const peerId = b4a.toString(feed.key, 'hex')


async function initializeSwarm() {
    const topic = Pear.config.args[1]
        ? b4a.from(Pear.config.args[1], 'hex')
        : (() => {
            console.warn('No topic provided. Generating a random one!');
            return crypto.randomBytes(32);
        })();

    console.log('Using topic:', Pear.config.args[1], b4a.toString(topic, 'hex'));



    // console.log('Pear.config.args[1]-----', Pear.config.args[0])
    // console.log('topiccccccc-c--c-c-c', topic)
    const conns = []
    swarm.on('connection', connection => {
        const name = b4a.toString(connection.remotePublicKey, 'hex')
        console.log(`New peer connected: ${name}`)

        feed.replicate(connection)

        conns.push(connection)

        connection.once('close', () => conns.splice(conns.indexOf(connection), 1))

        connection.on('data', async (data) => {
            try {
                const message = data.toString();

                // Ignore non-JSON messages
                if (!isValidJSON(message)) {
                    console.log('Ignoring non-JSON message:');
                    return;
                }

                const parsedData = JSON.parse(message);

                // Ignore self-sent messages
                if (parsedData.origin === peerId) {
                    console.log('Ignoring self-sent message:', parsedData.message);
                    return;
                }

                // Save the message to the database
                const timestamp = Date.now();
                await db.put(timestamp.toString(), { message: parsedData.message, origin: parsedData.origin });
                console.log(`Saved message at ${timestamp}: ${parsedData.message}`);

            } catch (error) {
                console.error('Error handling incoming message:', error);
            }
        });

        // Send previous messages to the new peer
        sendPreviousMessagesToPeer(connection);
    })

    process.stdin.on('data', async (data) => {
        const command = data.toString().trim();
        if (command === 'read') {
            await readMessages();
        } else {
            sendMessageToPeers(conns, command);
        }
    })


    const discovery = swarm.join(topic, {
        client: true,
        server: true,
    })

    discovery.flushed().then(() => {
        console.log('Joined topic:', b4a.toString(topic, 'hex'))
    })
}

export function isValidJSON(message) {
    try {
        JSON.parse(message);
        return true;
    } catch (e) {
        return false;
    }
}

export function sendMessageToPeers(conns, message) {
    const data = JSON.stringify({ message, origin: peerId });
    for (const connection of conns) {
        connection.write(data);
    }
}

export async function readMessages() {
    try {
        console.log('Reading messages from the database:');
        const stream = db.createReadStream();
        for await (const { key, value } of stream) {
            console.log(`[${new Date(parseInt(key))}] - ${value.message} (from: ${value.origin})`);
        }
    } catch (error) {
        console.error('Error reading from database:', error);
    }
}

// Function to send the previous messages to the new peer
async function sendPreviousMessagesToPeer(connection) {
    try {
        const stream = db.createReadStream();
        for await (const { key, value } of stream) {
            const messageData = JSON.stringify({ message: value.message, origin: value.origin });
            connection.write(messageData);
            console.log(`Sent previous message: ${value.message}`);
        }
    } catch (error) {
        console.error('Error sending previous messages to peer:', error);
    }
}


// Main function to initialize chat in the specified room
export function startChat() {
    const channelName = process.argv[5] || 'default-room'
    initializeSwarm(channelName)
    console.log(`Chat initialized in room: ${channelName}`)
}

startChat()
