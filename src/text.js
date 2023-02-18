import * as THREE from 'three';

import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export function createText(dot, text) {

    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = text;
    labelDiv.style.marginTop = '-1em';
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, 0.27, 0);
    dot.add(label);

}

/*
const moonGeometry = new THREE.SphereGeometry(0.27, 16, 16);
const moonMaterial = new THREE.MeshPhongMaterial({
    shininess: 5
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.scene.add(moon);

const moonDiv = document.createElement('div');
moonDiv.className = 'label';
moonDiv.textContent = 'Moon';
moonDiv.style.marginTop = '-1em';
const moonLabel = new CSS2DObject(moonDiv);
moonLabel.position.set(0, 0.27, 0);
moon.add(moonLabel);


*/
