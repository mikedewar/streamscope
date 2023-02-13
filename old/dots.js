import * as THREE from 'three';

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