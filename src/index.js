import * as THREE from 'three';
import * as dat from 'dat.gui';


import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const loader = new FontLoader();




const scene = new THREE.Scene();

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

scene.background = new THREE.Color('#2e2629')

const camera = new THREE.OrthographicCamera(
    -10.1, 10.1, -10, 10, 0, 1 // left right top bottom near far
);

camera.position.set(0, 0, 1);




const renderer = new THREE.WebGLRenderer();

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

// add the <canvas> element to the dom
document.body.appendChild(renderer.domElement);

const dotsGeometry = new THREE.BufferGeometry();
dotsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
        new Float32Array([-10, 0, 0]),
        3
    )
);
const dotsMaterial = new THREE.PointsMaterial(
    { size: 10, color: "#8CBEB2" }
);


var dots = [];


const lineMaterial = new THREE.LineBasicMaterial({ color: "#243f39" });

const points = [];

const borders = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10];

borders.map(function (i) {
    points.push(new THREE.Vector3(i, -10, 0));
    points.push(new THREE.Vector3(i, 10, 0));
})

const geometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.LineSegments(geometry, lineMaterial);

scene.add(line);

// default section params
var sectionParams = borders.slice(0, -1).map((e, i) => ({
    section: i,
    type: "none",
    field: "none",
    value: 0
}))

/*
// make the GUI
const gui = new dat.GUI()
const sectionFolder = gui.addFolder('Sections')
sectionParams.forEach(function (x) {
    folder = sectionFolder.addFolder(x.section)
    folder.add(x, "type")
    folder.add(x, "field")
    folder.add(x, "value", -0.1, 0.1)
})
*/


let font = undefined;
let textMesh1;

// text
loader.load('fonts/helvetiker_regular.typeface.json', function (response) {
    font = response;
    createText();
});

function createText(text) {

    const textGeo = new TextGeometry(text, {
        font: font,
        size: 0.2,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

    textMesh1 = new THREE.Mesh(textGeo, textMaterial);


    textMesh1.position.x = 0
    textMesh1.position.y = 10 - (Math.random() * 20);
    textMesh1.position.z = 0.5

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI;
    textMesh1.rotation.z = Math.PI;


    scene.add(textMesh1)
}

function getSection(x) {
    return Math.ceil((x / 20) * 10)
}

function animate() {
    requestAnimationFrame(animate);

    // update position
    dots.forEach(function (d) {
        d.geometry.position.x += d.dx(d.geometry.position.x)
        d.geometry.position.y += d.dy(d.geometry.position.y)
    })

    // remove dot from array if it's past the right edge of the screen
    dots = dots.filter(d => d.geometry.position.x < 21)


    // apply transforms 
    dots.forEach(function (d) {

        var section = getSection(d.geometry.position.x)


        // check if we just crossed a boundary

        if (d.section == section) {
            // don't do anything if we're still in the same section
            return
        }

        d.section = section

        switch (section) {

            case 2:
                // change the bearing based on the change size
                d.dy = function (y) {
                    var dy = d.data.change_size / 4000
                    //console.log(dy)
                    if (dy < 0) {
                        return Math.max(dy, -0.05)
                    }
                    return Math.min(dy, 0.05)
                };
                break;
            case 3:
                // change the colour based on the action type
                d.geometry.material = new THREE.PointsMaterial(
                    { size: 10, color: stringToColour(d.data.action) }
                );
                break;

            case 4:
                // stabilise the bearing
                d.dy = y => 0;
                break

            case 5:
                // use menu
                switch (sectionParams[5].type) {
                    case "force":
                        d.dy = y => d.data[sectionParams[5].field] * sectionParams[5].value
                        break;
                    case "stabilise":
                        d.dy = 0
                        break
                    default:
                        break
                }
                break
            case 6:
                // use menu
                switch (sectionParams[6].type) {
                    case "force":
                        d.dy = y => d.data[sectionParams[6].field] * sectionParams[6].value
                        break;
                    case "stabilise":
                        d.dy = y => 0
                        break
                    default:
                        break
                }

        }

    })


    renderer.render(scene, camera);
}
animate();

// wikipedia edits

var stringToColour = function (str) {
    // https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}


const url = "ws://wikimon.hatnote.com:9000";
const webSocket = new WebSocket(url);
webSocket.onmessage = (event) => {
    var data = JSON.parse(event.data);
    //console.log(data)

    var newDot = {
        data: data,
        section: 0,
        geometry: new THREE.Points(dotsGeometry, dotsMaterial),
        dy: y => 0,
        dx: x => 0.03 // 1 / (x + 6)
    }

    dots.push(newDot)
    scene.add(dots.at(-1).geometry);

    createText(data.page_title)

}