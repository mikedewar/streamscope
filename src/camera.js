import * as THREE from 'three';

export const camera = new THREE.OrthographicCamera(
    -10.1, 10.1, -10, 10, 0, 1 // left right top bottom near far
);

camera.position.set(0, 0, 1);