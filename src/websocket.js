import * as dots from './dots.js'
import * as scene from './scene.js'


export const webSocket = new WebSocket("ws://wikimon.hatnote.com:9000");

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    var newDot = dots.dots.addDot(data);

    scene.scene.add(newDot.points);

}