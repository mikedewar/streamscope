import * as THREE from 'three';

export const camera = new THREE.OrthographicCamera(
    -0.1, 10.1, 10, -10, 0.1, 2 // left right top bottom near far
);

camera.position.set(0, 0, 1);

/* keep the perspective camera around for debugging
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(10, 5, 20);
camera.layers.enableAll();
camera.layers.toggle(1);
*/