// import test from 'brittle';
// import sinon from 'sinon';
// import Hyperswarm from 'hyperswarm';
// import initializeSwarm from '../src/hyperswarm.js';
// import { isValidJSON, sendMessageToPeers } from '../src/client.js';

// // 🛡️ **Mock `bare-path` Dependency Globally**
// const mockBarePath = {
//     join: (...args) => args.join('/'),
// };

// // sinon.stub(await import('bare-path')).default = mockBarePath;

// sinon.stub(await import('bare-path'), 'default').value(() => { 
//     return {
//         join: (...args) => args.join('/'),
//     };
// });

// // 🛠️ **Mock Dependencies**
// const mockSwarm = sinon.createStubInstance(Hyperswarm);
// const mockDb = {
//     put: sinon.stub().resolves(),
//     createReadStream: sinon.stub().returns({
//         [Symbol.asyncIterator]: async function* () {
//             yield { key: '1234567890', value: { message: 'Hello', origin: 'peer1' } };
//         }
//     }),
// };

// // 🧠 **1. Test `isValidJSON`**
// test('isValidJSON should validate JSON strings correctly', (t) => {
//     t.ok(isValidJSON('{"key": "value"}'), 'Valid JSON string returns true');
//     t.not(isValidJSON('{key: value}'), 'Invalid JSON string returns false');
//     t.not(isValidJSON('random string'), 'Non-JSON string returns false');
// });

// // 🧠 **2. Test `sendMessageToPeers`**
// test('sendMessageToPeers should send messages to peers', (t) => {
//     const mockConnection = { write: sinon.stub() };
//     const connections = [mockConnection];
//     const message = 'Test Message';
//     const peerId = 'peer123';

//     sendMessageToPeers(connections, message, peerId);

//     t.is(mockConnection.write.calledOnce, true, 'Connection write was called once');
//     const expectedPayload = JSON.stringify({ message, origin: peerId });
//     t.is(mockConnection.write.firstCall.args[0], expectedPayload, 'Correct payload sent');
// });

// // 🧠 **3. Test `readMessages`**
// test('readMessages should read messages from the database', async (t) => {
//     const consoleLogStub = sinon.stub(console, 'log');

//     await readMessages(mockDb);

//     t.is(consoleLogStub.calledWithMatch('Hello'), true, 'Log includes message from database');
//     consoleLogStub.restore();
// });

// // 🧠 **4. Test `initializeSwarm`**
// test('initializeSwarm should set up swarm correctly', async (t) => {
//     sinon.stub(console, 'log'); // Suppress console logs during test

//     const mockSwarmJoin = sinon.stub().returns({
//         flushed: () => Promise.resolve(),
//     });
//     sinon.stub(Hyperswarm.prototype, 'join').callsFake(mockSwarmJoin);

//     await initializeSwarm();

//     t.ok(mockSwarmJoin.calledOnce, 'Swarm join was called once');
//     console.log.restore();
//     Hyperswarm.prototype.join.restore();
// });

import test from 'brittle';
import initializeSwarm from '../src/hyperswarm.js';
// import Hyperswarm from 'hyperswarm';
// import { initializeSwarm } from '../src/hyperswarm.js';

test('Hyperswarm should initialize', async (t) => {
    const swarm = initializeSwarm('1cf5734dfd951f71f12783fd09ebb6c619adad832e4febc0a7781db639f00db5');
    t.ok(swarm, 'Hyperswarm instance created');
});

