import { startChat } from "./app/chat";
import { startEditor } from "./app/editor";
import process from 'bare-process'

const appType = process.argv[4]
console.log('apptype----', appType)
switch(appType) {
    case 'chat':
        startChat()
        break;
    case 'editor':
        startEditor()
        break;
    default:
        console.log('Invalid option. Use chat | editor')
}