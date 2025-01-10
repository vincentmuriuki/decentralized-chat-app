import Hyperswarm from 'hyperswarm'
import Hypercore from 'hypercore'
import crypto from 'hypercore-crypto'

const swarm = new Hyperswarm()
const core = new Hypercore('./data/hypercore')

/**
 * Generate a deterministic topic hash
 * @param {string} topic - The topic to hash
 * @returns {Buffer} - A 32-byte hash buffer
 */
function getTopicHash(topic) {
    const topicBuffer = Buffer.from(topic) // Convert topic string to Buffer
    return crypto.data(topicBuffer) // Generate a consistent hash
}

function initializeSwarm(topic) {
    const topicHash = getTopicHash(topic)
    console.log('Topic Hash:', topicHash.toString('hex'))

    swarm.join(topicHash, {
        lookup: true,
        announce: true
    })

    swarm.on('connection', (connection, info) => {
        console.log('New peer connected:', info.peer)
        connection.on('data', (data) => {
            console.log('Received:', data.toString())
        })
    })

    console.log(`Swarm initialized on topic: ${topic}`)
    return swarm
}

export default initializeSwarm;
