import initializeSwarm from "../hyperswarm";
import { initializeHyperBee } from "../hyperbee";
import process from 'bare-process'

export function startEditor() {
    const swarm = initializeSwarm('editor-app')
    const db = initializeHyperBee()

    swarm.on('connection', connection => {
        connection.on('data', data => {
            db.put('document', data.toString())
            console.log('Document updated: ', data.toString())
        })
    })

    process.stdin.on('data', data => {
        db.put('document', data.toString())
        swarm.connections.forEach(connection => {
            connection.write(data)
        })
    })
}