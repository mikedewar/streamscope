import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export function createText(dot, text) {

    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = text;
    labelDiv.style.marginTop = '-1em';
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, 0.27, 0);
    dot.add(label);
    dot.isLabelled = true;

}