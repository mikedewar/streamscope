// in here we're going to have everything to do with the renderer and holds the top level animation
// loop. 
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

import * as scene from './scene.js'
import * as camera from './camera.js'
import * as dots from './dots.js'
import * as sections from './sections.js'
import * as observer from './observer.js'

const renderer = new THREE.WebGLRenderer();

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

// a special renderer for text
var labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

// add the <canvas> element to the dom
document.body.appendChild(renderer.domElement);

// let's do three fields right now
var mySections = new sections.Sections(4, 10);

mySections.sections.forEach(s => scene.scene.add(s.line))

// get some dots
var myDots = new dots.Dots(mySections.sections);

// instantiate websocket (move this out eventually)
export const webSocket = new WebSocket("ws://wikimon.hatnote.com:9000");

// make an observer that learns about the event object
window.allSeeingEye = new observer.Observer();

webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    //console.log(data)
    var newDot = myDots.addDot(data);
    scene.scene.add(newDot.points);

    // update the observer (consider sampling maybe?)
    window.allSeeingEye.update(data)
    //console.log(allSeeingEye.getFields(["string", "boolean"]))
}

document.addEventListener(
    "newField",
    x => mySections.sections.forEach(s => s.updateMenu())
)

function animate() {
    requestAnimationFrame(animate);

    myDots.update_position()

    renderer.render(scene.scene, camera.camera);
    labelRenderer.render(scene.scene, camera.camera);

}

console.log("- -: S T R E A M S C O P E : - -");

animate();