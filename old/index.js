import * as THREE from 'three';
import * as dat from 'dat.gui';

import * from './dots.js';


import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const loader = new FontLoader();


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


}