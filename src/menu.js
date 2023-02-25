import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export class Menu {

    constructor(section) {

        const observer = window.allSeeingEye

        let options
        if (observer === undefined) {
            options = []
        } else {
            options = window.allSeeingEye.getFields(section.allowableTypes)
        }

        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';


        const p1 = labelDiv.appendChild(document.createElement('label'))
        p1.textContent = section.type + ": "
        p1.for = "field"

        const select = labelDiv.appendChild(document.createElement('select'))
        select.id = "field"

        select.addEventListener('change', function (e) {
            section.setField(select.value)
        });

        options.forEach(element => {
            const option = select.appendChild(document.createElement('option'))
            option.value = element
            option.text = element
        });

        const label = new CSS2DObject(labelDiv);
        label.position.set(section.width / 2, 9, 0.5);
        section.line.add(label);

        this.id = label.id

    }

}