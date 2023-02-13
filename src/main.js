// in here we're going to have everything to do with the renderer and holds the top level animation
// loop. 
import * as THREE from 'three';

import * as scene from './scene.js'
import * as camera from './camera.js'
import * as dots from './dots.js'
import * as fields from './fields.js'


const renderer = new THREE.WebGLRenderer();

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

// add the <canvas> element to the dom
document.body.appendChild(renderer.domElement);

// let's do three fields right now
fields = new fields.Fields(3, window.innerWidth);

// get some dots
var myDots = new dots.Dots(fields.fields);

// instantiate websocket (move this out eventually)
export const webSocket = new WebSocket("ws://wikimon.hatnote.com:9000");

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data)
    var newDot = myDots.addDot(data);
    scene.scene.add(newDot.points);
}

function animate() {
    requestAnimationFrame(animate);

    myDots.update_position()

    renderer.render(scene.scene, camera.camera);

}

console.log("- -: S T R E A M S C O P E : - -");

animate();